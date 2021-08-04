const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const questionSchema = mongoose.Schema(
	{
		question: {
			type: String,
			required: true,
		},
		category: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Category",
				required: true,
			},
		],
		is_active: {
			type: Boolean,
			default: true,
		},
		is_delete: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);

/**
 * @typedef Question
 */
const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
