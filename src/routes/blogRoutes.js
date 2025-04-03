// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { verifyToken } = require("./adminRoutes");

router.post("/create", verifyToken, async (req, res) => {
  try {
    const {
      slug,
      title,
      date,
      banner,
      tags,
      preview,
      ctaText,
      ctaLink,
      content,
    } = req.body;

    const newBlog = new Blog({
      slug,
      title,
      date,
      banner,
      tags: tags.split(",").map((tag) => tag.trim()),
      preview,
      cta: {
        text: ctaText,
        link: ctaLink,
      },
      content,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving blog" });
  }
});

router.get("/get-all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

router.get("/get-all-blogs/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

module.exports = router;
