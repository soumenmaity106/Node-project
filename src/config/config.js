const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid("production", "development", "test"),
		PORT: Joi.number().default(3000),
		// MONGODB_URL: Joi.string().default(
		// 	"mongodb://brain1uMMong0User:PL5qnU9nuvX0pBa@nodeserver.mydevfactory.com:27017/A2zcater?authSource=admin"
		// ),
		JWT_SECRET: Joi.string().default(3000),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
			.default(30)
			.description("minutes after which access tokens expire"),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
			.default(30)
			.description("days after which refresh tokens expire"),
		SMTP_HOST: Joi.string().description("server that will send the emails"),
		SMTP_PORT: Joi.number().description(
			"port to connect to the email server"
		),
		SMTP_USERNAME: Joi.string().description("username for email server"),
		SMTP_PASSWORD: Joi.string().description("password for email server"),
		EMAIL_FROM: Joi.string().description(
			"the from field in the emails sent by the app"
		),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	mongoose: {
		url: envVars.MONGODB_URL,
		options: {
			// useCreateIndex: true,
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			useUnifiedTopology: true,
			useNewUrlParser: true,
		},
	},
	jwt: {
		secret: envVars.JWT_SECRET,
		superAdmin: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes: 10,
	},

	homeUrl: "http://localhost:8080",
};