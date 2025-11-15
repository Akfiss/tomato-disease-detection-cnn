import multer from 'multer';

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }

    const fileName = file.originalname.split('.')[0];
    if (fileName.length > 100) {
        cb(new Error('File name too long!'), false);
    }
};

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: fileFilter
});

export const uploadSingle = upload.single('picture');
