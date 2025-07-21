const cloudinary = require('../utils/cloudinary');

module.exports.postImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Use cloudinary's upload_stream properly
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "geo_journal",
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: error.message });
        }
        console.log('Image uploaded successfully');
        return res.status(200).json({
          message: "Image uploaded successfully",
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ error: err.message });
  }
}