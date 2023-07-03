import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' },
  properties:[{type: Object}]
});

export const Category = models?.Category || model("Category", CategorySchema);
