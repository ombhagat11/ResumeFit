const fs = require('fs');
const path = require('path');
const ApiError = require('./apiError');

function resolvePdfParse() {
  const localPackage = path.join(process.cwd(), 'node_modules', 'pdf-parse');
  const backendPackage = path.join(__dirname, '..', '..', 'node_modules', 'pdf-parse');
  if (fs.existsSync(localPackage)) return localPackage;
  if (fs.existsSync(backendPackage)) return backendPackage;
  return null;
}

async function extractPdfText(file) {
  if (!file) return '';
  if (file.mimetype && !file.mimetype.includes('pdf')) {
    throw new ApiError(400, 'Only PDF files are supported for document uploads');
  }

  const pdfParsePath = resolvePdfParse();
  if (!pdfParsePath) {
    throw new ApiError(500, 'pdf-parse is required for PDF parsing. Run npm install in Backend.');
  }

  const pdfParse = require(pdfParsePath);
  const parsed = await pdfParse(file.buffer);
  return (parsed.text || '').replace(/\s+/g, ' ').trim();
}

module.exports = { extractPdfText };
