const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/course'); // Import your Mongoose Model

const app = express();
const port = 3000;
const MONGODB_URI = 'YOUR_MONGODB_CONNECTION_STRING'; // ⬅️ REPLACE THIS

// --- Middleware Setup ---
// Use body-parser to parse incoming JSON data from the request body
app.use(bodyParser.json());
// OR
// app.use(express.json()); // If using Express 4.16.0+

// --- MongoDB Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- 💡 The Express Route for Bulk Insertion ---

app.post('/api/items/bulk', async (req, res) => {
    // 1. Get the data array from the request body
    const dataArray = req.body;

    // 2. Validate the incoming data (Crucial Step!)
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ 
            message: 'Invalid input. Please provide a non-empty JSON array of objects.' 
        });
    }

    try {
        // 3. Use Mongoose's `insertMany` method
        // This method is optimized for inserting multiple documents at once.
        const result = await Item.insertMany(dataArray);

        // 4. Send a success response
        res.status(201).json({
            message: `Successfully inserted ${result.length} documents.`,
            insertedCount: result.length,
            data: result // Returns the inserted documents
        });

    } catch (error) {
        // 5. Handle potential database errors (e.g., schema validation failure)
        console.error('Error during bulk insertion:', error);
        res.status(500).json({ 
            message: 'Failed to insert documents.',
            error: error.message 
        });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});