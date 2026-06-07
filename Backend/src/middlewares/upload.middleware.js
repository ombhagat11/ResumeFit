const fs = require('fs');
const path = require('path');
const ApiError = require('../utils/apiError');

function resolveOptionalPackage(packageName) {
  const localPackage = path.join(process.cwd(), 'node_modules', packageName);
  const backendPackage = path.join(__dirname, '..', '..', 'node_modules', packageName);
  if (fs.existsSync(localPackage)) return packageName;
  if (fs.existsSync(backendPackage)) return backendPackage;
  return null;
}

const multerPath = resolveOptionalPackage('multer');
const multer = multerPath ? require(multerPath) : null;

function unavailableUpload(req, res, next) {
  if (!req.is('multipart/form-data')) return next();
  return next(new ApiError(500, 'Multer is required for multipart PDF uploads. Run npm install in Backend.'));
}

const upload = multer
  ? multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: Number(process.env.MAX_UPLOAD_BYTES || 6 * 1024 * 1024), files: 2 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new ApiError(400, 'Only PDF uploads are allowed'));
      }
    })
  : null;

module.exports = {
  uploadResumeAndJd: upload ? upload.fields([{ name: 'resumePdf', maxCount: 1 }, { name: 'jobDescriptionPdf', maxCount: 1 }]) : unavailableUpload,
  uploadResume: upload ? upload.single('resumePdf') : unavailableUpload,
  uploadJobDescription: upload ? upload.single('jobDescriptionPdf') : unavailableUpload
};
