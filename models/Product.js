const { Schema, model, models, default: mongoose } = require("mongoose");

// We use schema to send data to the mongodb.
// It is important to add data which we want to send to mongodb
const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: Object },
},{
  timestamps: true
});

export const Product = models.Product || model("Product", ProductSchema);
