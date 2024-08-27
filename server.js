const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const csv = require("csv-parser");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
  // Load CSV data into MongoDB when the database connection is established
  loadCSVData();
});

// Define the City schema and model
const citySchema = new mongoose.Schema({
  id: Number,
  name: String,
  state_id: Number,
  state_code: String,
  state_name: String,
  country_id: Number,
  country_code: String,
  country_name: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
  },
  wikiDataId: String,
});

// Create a 2dsphere index on the location field
citySchema.index({ location: '2dsphere' });

const City = mongoose.model('City', citySchema);

// Load CSV data into MongoDB
const loadCSVData = () => {
  const cities = [];
  fs.createReadStream(path.join(__dirname, 'cities.csv'))
    .pipe(csv())
    .on('data', (row) => {
      const city = {
        id: row.id,
        name: row.name,
        state_id: row.state_id,
        state_code: row.state_code,
        state_name: row.state_name,
        country_id: row.country_id,
        country_code: row.country_code,
        country_name: row.country_name,
        location: {
          type: 'Point',
          coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
        },
        wikiDataId: row.wikiDataId,
      };
      cities.push(city);
    })
    .on('end', async () => {
      try {
        await City.insertMany(cities);
        console.log('CSV data loaded into MongoDB');
      } catch (err) {
        console.error('Error loading CSV data into MongoDB:', err);
      }
    });
};

// Function to find the closest city using geospatial query
const findClosestCity = async (lat, lon) => {
  try {
    const city = await City.findOne({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lon, lat] },
          $maxDistance: 50000, // 50 km radius, adjust as needed
        },
      },
    });
    return city;
  } catch (err) {
    console.error('Error finding closest city:', err);
    return null;
  }
};

// Route to get city by latitude and longitude
app.get('/geolocation', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const city = await findClosestCity(parseFloat(lat), parseFloat(lon));
  if (!city) {
    return res.status(404).json({ error: 'City not found' });
  }

  res.json({
    city: city.name,
    state: city.state_name,
    country: city.country_name,
    latitude: city.location.coordinates[1],
    longitude: city.location.coordinates[0],
  });
});

// Routes for other functionalities (e.g., posts, users, comments, messages)
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');
const messagesRoutes = require('./routes/messages');

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/messages', messagesRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Middleware to set global SEO meta tags
app.use((req, res, next) => {
  res.locals.siteName = 'Sraws';
  res.locals.defaultPageTitle = 'Default Page Title'; // Update with your default title
  res.locals.defaultPageDescription = 'Default Page Description'; // Update with your default description
  res.locals.defaultPageKeywords = 'default, keywords, for, your, website'; // Update with your default keywords

  next();
});

// Socket.IO setup
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://sraws.com"],
  },
});
const { authSocket, socketServer } = require("./socketServer");

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const notificationRoutes = require('./routes/notifications'); // Adjust the path as needed

app.use('/api', notificationRoutes);
app.use('/api', require('./routes/notifications'));

const cron = require('node-cron');
const checkAndSendNotificationEmail = require('./client/src/components/Notifier/notifyUsers');

cron.schedule('*/2 * * * *', checkAndSendNotificationEmail);

console.log('Notification email service started');



const feedbackRoutes = require('./routes/feedback');
app.use('/api/feedback', feedbackRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);