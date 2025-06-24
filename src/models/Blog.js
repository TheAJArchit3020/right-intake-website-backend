// models/Blog.js
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  date: String,
  banner: String,
  tags: [String],
  preview: String,
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  ogImage: String,
  keywords: [String],
  pinned: {
    type: Boolean,
    default: false,
  },

  // Block-based content
  content: [
    {
      type: { type: String },
      data: mongoose.Schema.Types.Mixed,
    },
  ],
});

module.exports = mongoose.model("Blog", BlogSchema);
