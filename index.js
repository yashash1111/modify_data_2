const express = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');
require('dotenv').config();

const app = express();
const port = 3010;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (ensure you have a 'static' folder)
app.use(express.static('static'));

// MongoDB Atlas connection setup
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));


const MenuItem = require("./models/MenuItem");

// Update a menu item by ID
app.put("/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error });
    }
});

// Delete a menu item by ID
app.delete("/menu/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const deletedItem = await MenuItem.findByIdAndDelete(id);

      if (!deletedItem) {
          return res.status(404).json({ message: "Menu item not found" });
      }
      res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting menu item", error });
  }
});

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
