
module.exports.postImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: "geo_journal" },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        res.json({ url: result.secure_url });
      }
    );
    console.log('image is working fine');
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}