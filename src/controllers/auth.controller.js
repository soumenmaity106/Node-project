const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	const tokens = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(
		email,
		password
	);
	const tokens = await tokenService.generateAuthTokens(user);
	res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
	const tokens = await authService.refreshAuth(req.body.refreshToken);
	res.send({ ...tokens });
});
const userProfile = catchAsync(async (req, res) => {
	const token =
		req.params.token || req.query.token || req.headers["x-access-token"];
	const usertoken = await tokenService.verifyRouterToken(token);
	const user = await authService.finduserRole(usertoken.sub);
	if (user) {
		return res.send({
			success: true,
			data: user,
		});
	}
});

const profileImageUpload = catchAsync(async (req, res) => {
	const token =
		req.params.token || req.query.token || req.headers["x-access-token"];
	const usertoken = await tokenService.verifyRouterToken(token);
	let file = req.file.filename;
	if (!req.file) {
		return res.send({
			success: false,
			message: "File not found",
		});
	}
	const uploadImage = await authService.profileImageUpload(
		usertoken.sub,
		file
	);
	const user = await authService.finduserRole(usertoken.sub);
	for (let key in req.body) {
		user[key] = req.body[key];
	}
	let save = await user.save();

	return res.send({
		success: true,
		message: "Success",
	});
});

module.exports = {
	register,
	login,
	logout,
	refreshTokens,
	userProfile,
	profileImageUpload,
};
