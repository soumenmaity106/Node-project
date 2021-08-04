const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const {User,Token} = require("../models/index")
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const finduserRole = async (userid) => {
	try {
		const user = await User.findOne({ _id: userid})
		if (user) { 
			return user;
		} else {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
		}
	} catch (err) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
	}
};

const profileImageUpload = async (id, filename) => {
	try {
		const uploadimage = await User.updateOne(
			{ _id: id },
			{
				$set: {
					profileImage: filename,
				},
			}
		);
		return uploadimage;
	} catch (err) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Error");
	}
};


module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  finduserRole,
  profileImageUpload
};
