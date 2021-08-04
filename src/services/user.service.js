const httpStatus = require("http-status");
const csv = require("fast-csv");
const fs = require("fs");
const mongoose = require("mongoose");
const { User, Category, Question } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 */
const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}
	return User.create(userBody);
};

/**
 * Query for users
 */
const queryUsers = async (filter, options) => {
	const users = await User.paginate(filter, options);
	return users;
};

/**
 * Get user by id
 */
const getUserById = async (id) => {
	return User.findById(id);
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
	return User.findOne({ email });
};

/**
 * Update user by id
 */
const updateUserById = async (userId, updateBody) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	if (
		updateBody.email &&
		(await User.isEmailTaken(updateBody.email, userId))
	) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}
	Object.assign(user, updateBody);
	await user.save();
	return user;
};

/**
 * Delete user by id
 */
const deleteUserById = async (userId) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	await user.remove();
	return user;
};

/**
 * Create Category
 */
const createCategory = async (body) => {
	const category = new Category({
		category: body.category,
	});
	let savecategory = await category.save();

	return savecategory;
};
/**
 * Create List
 */
const categoryList = async () => {
	let categoryfind = await Category.find();
	return categoryfind;
};
/**
 * Add Question
 */
const addQuestion = async (file) => {
	let fileRows = [];
	csv.parseFile(file.path)
		.on("data", async function (data) {
			let str = data[1];
			const myArr = str.split(",");
			let questiondata = {
				question: data[0],
				category: myArr,
			};
			let newschema = new Question(questiondata);
			let savedata = await newschema.save();
		})
		.on("end", function () {
			fs.unlinkSync(file.path); // remove temp file
		});
};
/**
 * Add List
 */
const Questionlist = async () => {
	let questiondata = await Question.find().populate("category", "category");
	if (questiondata) {
		var serviceName = {};
		for (var i = 0; i < questiondata.length; i++) {
			var temp = questiondata[i];
			var cat = temp.category;
			for (let j = 0; j < cat.length; j++) {
				let cat1 = cat[j].category.toString();
				if (!serviceName.hasOwnProperty(cat1)) {
					serviceName[cat1] = [];
				}
				serviceName[cat1].push(temp);
			}
		}
		let result = serviceName;
		return result;
	}
};

module.exports = {
	createUser,
	queryUsers,
	getUserById,
	getUserByEmail,
	updateUserById,
	deleteUserById,
	createCategory,
	categoryList,
	addQuestion,
	Questionlist,
};
