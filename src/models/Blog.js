// models/Blog.js
const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  heading: String,
  paragraph: String,
  image: String,
  imageAlt: String,
});

const BlogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  date: String,
  banner: String,
  tags: [String],
  preview: String,
  cta: {
    text: String,
    link: String,
  },
  content: [ContentSchema],
});

module.exports = mongoose.model("Blog", BlogSchema);
