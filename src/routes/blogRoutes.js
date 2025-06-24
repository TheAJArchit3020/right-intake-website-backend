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
      content,
      metaTitle,
      metaDescription,
      ogImage,
      keywords,
    } = req.body;

    const newBlog = new Blog({
      slug,
      title,
      date,
      banner,
      tags,
      preview,
      content,
      metaTitle,
      metaDescription,
      ogImage,
      keywords,
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

router.get("/get-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

router.put("/update-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error updating blog" });
  }
});

router.delete("/delete-blog/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
});

router.get("/pinned", async (req, res) => {
  try {
    const pinnedBlogs = await Blog.find({ pinned: true }).sort({ date: -1 });
    res.json(pinnedBlogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pinned blogs" });
  }
});

module.exports = router;
