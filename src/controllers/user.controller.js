const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const createCategory = catchAsync(async (req, res) => {
	let category = await userService.createCategory(req.body);
	res.send(category);
});

const categoryList = catchAsync(async (req, res) => {
	let categoris = await userService.categoryList();
	res.send(categoris);
});

const addQuestion = catchAsync(async (req, res) => {
	let file = req.file;
	let addquestion = await userService.addQuestion(file);
	return res.send({
		success: true,
		message: "Success",
	});
});

const Questionlist = catchAsync(async (req, res) => {
	let questionlist = await userService.Questionlist();
	res.send(questionlist);
});

module.exports = {
	createCategory,
	categoryList,
	addQuestion,
	Questionlist,
};
