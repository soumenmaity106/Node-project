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
		//console.log("file", file);
		if (file.mimetype == "text/csv") {
			cb(null, true);
		} else {
			cb(null, false);
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Only .csv format allowed!"
			);
		}
	},
});
module.exports = imageupload;
