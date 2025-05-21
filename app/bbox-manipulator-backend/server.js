const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static images from 'test/scenes' and potentially 'raw_images_path' if needed directly
app.use('/images', express.static(path.join(__dirname, '../../data')));
// Example: If raw_images_path is "/Users/ykj/Desktop/github/rombus_annotation_tool/data"
// And you want to serve it under /raw_images
// app.use('/raw_images', express.static('/Users/ykj/Desktop/github/rombus_annotation_tool/data'));


app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});