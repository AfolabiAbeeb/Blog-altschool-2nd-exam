const Blog = require('../models/blogModel');
const calculateReadingTime = require('../utils/calculateReadingTime');

exports.createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;
    const reading_time = calculateReadingTime(body);
    const blog = await Blog.create({
      title,
      description,
      tags,
      body,
      author: req.user.id,
      reading_time
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, title, author, tags, orderBy } = req.query;
    let filter = { state: "published" };
    if (title) filter.title = { $regex: title, $options: "i" };
    if (author) filter.author = author;
    if (tags) filter.tags = { $in: tags.split(",") };

    let sort = {};
    if (orderBy) {
      const [field, direction] = orderBy.split(":");
      sort[field] = direction === "desc" ? -1 : 1;
    }

    const blogs = await Blog.find(filter)
      .populate("author", "first_name last_name email")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSinglePublishedBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, state: "published" })
      .populate("author", "first_name last_name email");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.read_count += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user.id });
    if (!blog) return res.status(404).json({ error: "Blog not found or unauthorized" });

    Object.assign(blog, req.body);
    if (req.body.body) blog.reading_time = calculateReadingTime(req.body.body);
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!blog) return res.status(404).json({ error: "Blog not found or unauthorized" });

    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};