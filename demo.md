# Demo app for ACA

We like to host a docker container with an application like this Getting data from the internet ( in this app image and Wheater) . Also, another app  with an additional storage with PDF files. The container should retrieve a set of files( PDF) and store a csv file in a storage as result of application.


## Setup

Set some environment variables:

PROJECT="weater-pdf-app"
RESOURCE_GROUP="rg-$PROJECT"
LOCATION="westeurope"
TAG="$PROJECT"

LOG_ANALYTICS_WORKSPACE="log-$PROJECT"
CONTAINERAPPS_ENVIRONMENT="cae-$PROJECT"

UNIQUE_IDENTIFIER=${GITHUB_USER:-$(whoami)}
REGISTRY="weatherapp${UNIQUE_IDENTIFIER}"
IMAGES_TAG="1.0"

# Create a resource group and a Log Analytics workspace
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --tags system="$TAG"

az monitor log-analytics workspace create \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --tags system="$TAG" \
  --workspace-name "$LOG_ANALYTICS_WORKSPACE"

LOG_ANALYTICS_WORKSPACE_CLIENT_ID=$(
  az monitor log-analytics workspace show \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LOG_ANALYTICS_WORKSPACE" \
    --query customerId  \
    --output tsv | tr -d '[:space:]'
)
echo "LOG_ANALYTICS_WORKSPACE_CLIENT_ID=$LOG_ANALYTICS_WORKSPACE_CLIENT_ID"

LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=$(
  az monitor log-analytics workspace get-shared-keys \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LOG_ANALYTICS_WORKSPACE" \
    --query primarySharedKey \
    --output tsv | tr -d '[:space:]'
)
echo "LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=$LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET"

## Create a Container Registry
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --tags system="$TAG" \
  --name "$REGISTRY" \
  --workspace "$LOG_ANALYTICS_WORKSPACE" \
  --sku Standard \
  --admin-enabled true

REGISTRY_URL=$(
  az acr show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$REGISTRY" \
    --query "loginServer" \
    --output tsv
)

echo "REGISTRY_URL=$REGISTRY_URL"

## Createa an container apps environment
az containerapp env create \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --tags system="$TAG" \
    --name "$CONTAINERAPPS_ENVIRONMENT" \
    --logs-workspace-id "$LOG_ANALYTICS_WORKSPACE_CLIENT_ID" \
    --logs-workspace-key "$LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET"

az containerapp env storage set \
    --name "$CONTAINERAPPS_ENVIRONMENT" \
    --resource-group "$RESOURCE_GROUP" \
    --storage-name files \
    --storage-type AzureFile \
    --azure-file-account-name containerapps \
    --azure-file-account-key $STORAGE_ACCOUNT_KEY \
    --azure-file-share-name contostore \
    --access-mode ReadWrite

az containerapp registry set \
    --name "$CONTAINERAPPS_ENVIRONMENT" \
    --resource-group "$RESOURCE_GROUP" \
    --server "$REGISTRY_URL" \
    --identity system 


## Build and push the container images
az acr build \
  --registry "$REGISTRY" \
  --image "$REGISTRY_URL/weatherapp:$IMAGES_TAG" \
  --file Dockerfile .

az acr build \
  --registry "$REGISTRY" \
  --image "$REGISTRY_URL/pdf-scan:$IMAGES_TAG" \
  --file pdf-app/Dockerfile pdf-app/


## Create the container apps
az containerapp create \
  --name weatherapp \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINERAPPS_ENVIRONMENT" \
  --image "$REGISTRY_URL/weatherapp:$IMAGES_TAG" \
  --target-port 8080 \
  --ingress external \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --enable-dapr \
  --dapr-app-id weatherapp \
  --dapr-app-port 8080 \
  --registry-identity system \
  --registry-server "$REGISTRY_URL" 

# we need to set the storage for the pdf scan app via yaml

az containerapp create \
  --name pdfscan \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINERAPPS_ENVIRONMENT" \
  --image "$REGISTRY_URL/pdf-scan:blob" \
  --registry-identity system \
  --registry-server "$REGISTRY_URL" \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 1 \
  --env-vars \
    "AZURE_STORAGE_ACCOUNT=contostore" \
    "AZURE_STORAGE_BLOB=pdfs" \
    "AZURE_STORAGE_ACCESSKEY=secretref:storage-account-key" \
  --secrets \
    "storage-account-key=$AZURE_STORAGE_ACCESSKEY"

Create a volume mount for the output    
dir_mode=0777,file_mode=0777,uid=999,gid=999,mfsymlinks,nobrl,cache=none

az containerapp show --name pdfscan --resource-group "$RESOURCE_GROUP" -o yaml > pdf-scan-app.yaml

## Add this snipper:

      volumeMounts:
      - volumeName: pdfs
        mountPath: /app/pdfs
        subPath: pdfs
      - volumeName: output
        mountPath: /app/output
        subPath: pdfs
    volumes:
    - name: output
      storageType: AzureFile
      storageName: files
      mountOptions: dir_mode=0777,file_mode=0777,uid=1000,gid=1000,mfsymlinks,nobrl,cache=none
    - name: pdfs
      storageType: AzureFile
      storageName: files
      mountOptions: dir_mode=0777,file_mode=0777,uid=1000,gid=1000,mfsymlinks,nobrl,cache=none


## References:

https://learn.microsoft.com/en-us/azure/container-apps/storage-mounts?tabs=smb&pivots=azure-cli
https://learn.microsoft.com/en-us/azure/container-apps/managed-identity-image-pull?tabs=bash&pivots=console

## More demos, workshops, and training

- [JAVA runtime demo](https://azure.github.io/aca-java-runtimes-workshop/)
- 