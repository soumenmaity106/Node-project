const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
const upload = require("../../utils/fileupload");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post(
	"/register",
	validate(authValidation.register),
	authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
	"/refresh-tokens",
	validate(authValidation.refreshTokens),
	authController.refreshTokens
);
router.get("/user-profile", authController.userProfile);
router.post(
	"/profile-upload",
	upload.single("profile"),
	authController.profileImageUpload
);

module.exports = router;
