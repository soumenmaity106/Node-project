const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const csvupload = require("../../utils/csvupload");

const router = express.Router();
router.post("/createcategory", userController.createCategory);
router.get("/category", userController.categoryList);
router.post(
	"/addquestion",
	csvupload.single("csv-file"),
	userController.addQuestion
);
router.get("/questionlist", userController.Questionlist);
module.exports = router;
