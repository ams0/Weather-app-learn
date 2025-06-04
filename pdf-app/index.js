// This script scans the /pdfs directory for PDF files, extracts their filename, page count, and last modified date, and writes the results to /output/pdf_report.csv

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfsDir = path.join(__dirname, 'pdfs');
const outputDir = path.join(__dirname, 'output');
const outputCsv = path.join(outputDir, 'pdf_report.csv');

async function getPdfInfo(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return {
    pageCount: data.numpages,
  };
}

async function scanAndWriteCsv() {
  const files = fs.readdirSync(pdfsDir).filter(f => f.endsWith('.pdf'));
  const rows = [['Filename', 'PageCount', 'LastModified']];

  for (const file of files) {
    const filePath = path.join(pdfsDir, file);
    const stats = fs.statSync(filePath);
    let pageCount = '';
    try {
      const info = await getPdfInfo(filePath);
      pageCount = info.pageCount;
    } catch (e) {
      pageCount = 'Error';
    }
    rows.push([
      file,
      pageCount,
      stats.mtime.toISOString()
    ]);
  }

  const csvContent = rows.map(r => r.join(',')).join('\n');
  fs.writeFileSync(outputCsv, csvContent);
  console.log(`CSV report written to ${outputCsv}`);
}

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir);
  }

  // Initial scan
  await scanAndWriteCsv();

  // Watch for changes in the pdfs directory
  fs.watch(pdfsDir, { persistent: true }, async (eventType, filename) => {
    if (filename && filename.endsWith('.pdf')) {
      // Debounce to avoid multiple triggers
      if (main.debounceTimeout) clearTimeout(main.debounceTimeout);
      main.debounceTimeout = setTimeout(async () => {
        await scanAndWriteCsv();
      }, 500);
    }
  });

  console.log(`Watching for new PDF files in ${pdfsDir}...`);
}

main();
