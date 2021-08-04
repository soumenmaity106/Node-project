const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const categorySchema = mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
			lowercase: true,
		},
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
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * @typedef Category
 */
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
