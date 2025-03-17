const multer = require('multer');
const apiError = require('../utils/apiError');

const multerOptions = () => {

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image'))
        cb(null, true)
    else
        cb(new apiError('Only Images Allowed', 400), false)

    }
    
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
}


exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);


