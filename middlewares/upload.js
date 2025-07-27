import multer from 'multer';

// Use memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });


export default upload;
