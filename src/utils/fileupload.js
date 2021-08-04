const multer = require("multer");
const path = require("path");
const ApiError = require("./ApiError");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../uploads"));
	},
	filename: function (req, file, cb) {
		cb(null, +new Date() + file.originalname);
	},
});
const imageupload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Only .png, .jpg and .jpeg format allowed!"
			);
		}
	},
});
module.exports = imageupload;