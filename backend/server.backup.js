app.get("/post", async (req, res) => {
  try {
    const data = await Posts.find({});
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "system error" });
  }
});

app.post("/post", async (req, res) => {
  const post = req.body;

  if (!post.message) {
    return res
      .status(404)
      .json({ success: false, message: "all fields required" });
  }

  const newPost = new Posts(post);

  try {
    await newPost.save();
    res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "system error" });
  }
});

app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Posts.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "system error" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Posts.findById(id);
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "system error" });
  }
});

app.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  try {
    await Posts.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json({ success: true, message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "system error" });
  }
});
