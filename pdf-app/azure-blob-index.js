// This script watches an Azure Blob Storage container for new PDF files, extracts their filename, page count, and last modified date, and writes the results to /output/pdf_report.csv

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { BlobServiceClient } = require('@azure/storage-blob');

const outputDir = path.join(__dirname, 'output');
const outputCsv = path.join(outputDir, 'pdf_report.csv');

const AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
const AZURE_STORAGE_ACCESSKEY = process.env.AZURE_STORAGE_ACCESSKEY;
const AZURE_STORAGE_BLOB = process.env.AZURE_STORAGE_BLOB;

if (!AZURE_STORAGE_ACCOUNT || !AZURE_STORAGE_ACCESSKEY || !AZURE_STORAGE_BLOB) {
  console.error('Missing one or more required environment variables: AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESSKEY, AZURE_STORAGE_BLOB');
  process.exit(1);
}

const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  new (require('@azure/storage-blob').StorageSharedKeyCredential)(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESSKEY)
);

async function getPdfInfoFromBuffer(buffer) {
  const data = await pdf(buffer);
  return {
    pageCount: data.numpages,
  };
}

async function scanAndWriteCsv() {
  const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_BLOB);
  const rows = [['Filename', 'PageCount', 'LastModified']];

  for await (const blob of containerClient.listBlobsFlat({ prefix: '' })) {
    if (!blob.name.endsWith('.pdf')) continue;
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
    let pageCount = '';
    try {
      const downloadBlockBlobResponse = await blockBlobClient.download();
      const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
      const info = await getPdfInfoFromBuffer(buffer);
      pageCount = info.pageCount;
    } catch (e) {
      pageCount = 'Error';
    }
    rows.push([
      blob.name,
      pageCount,
      blob.properties.lastModified ? new Date(blob.properties.lastModified).toISOString() : ''
    ]);
  }

  const csvContent = rows.map(r => r.join(',')).join('\n');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  fs.writeFileSync(outputCsv, csvContent);
  console.log(`CSV report written to ${outputCsv}`);
}

function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

async function main() {
  await scanAndWriteCsv();
  // Poll every 10 seconds for new/changed PDFs
  setInterval(scanAndWriteCsv, 10000);
  console.log(`Watching Azure Blob Storage container '${AZURE_STORAGE_BLOB}' for new or updated PDF files...`);
}

main();
