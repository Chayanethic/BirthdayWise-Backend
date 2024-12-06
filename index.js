const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
// Initialize Express
const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173',// Configure this based on your needs
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB Connection
const uri = process.env.DATABASE_URL; // Update with your MongoDB URI
mongoose.connect(uri, )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Mongoose Schema and Model
const nameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uniqueid : {type: String, required : true},
  imageurl : {type:String}
});

const NameModel = mongoose.model('Name', nameSchema);


// Routes
app.get('/', (req, resp) => {
  resp.send("HAPPY BIRTHDAY")
})

// POST: Add a new name
app.post('/addwish', async (req, res) => {
  try {
    const {name, uniqueid, imageurl} = req.body
    const newName = new NameModel({ name, uniqueid,imageurl });
    const savedName = await newName.save();
    res.status(201).json(savedName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve data by MongoDB ID
app.get('/wishmongoid/:id', async (req, res) => {
  try {
    const nameData = await NameModel.findById(req.params.id);
    if (!nameData) {
      return res.status(404).json({ error: 'Name not found' });
    }
    res.status(200).json(nameData.name);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // GET: Retrieve data by name
// app.get('/getnamebyname/:name', async (req, res) => {
//   try {
//     const nameData = await NameModel.findOne({ name: req.params.name });
//     if (!nameData) {
//       return res.status(404).json({ error: 'Name not found' });
//     }
//     res.status(200).json(nameData.name,nameData.age);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// GET: Retrieve data by `uniqueid`
app.get('/wish/:uniqueid', async (req, res) => {
  try {
    // Retrieve the uniqueid parameter from the URL
    const { uniqueid } = req.params;

    // Find the document with the matching uniqueid
    const nameData = await NameModel.findOne({ uniqueid });

    if (!nameData) {
      return res.status(404).json({ error: 'Name with uniqueid not found' });
    }

    // Respond with the name data
    res.status(200).json(nameData.name);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
