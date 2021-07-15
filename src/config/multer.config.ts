import multer from 'multer';

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, './files');
	},
	filename: (_req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

export default multer({ storage });
