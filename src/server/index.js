require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path'); 

const PORT = process.env.PORT ?? 80;

const createApp = async () => {
  const app = express();

  // Logging middleware
  app.use(morgan("dev"));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const corsOptions = {
    origin: 'http://localhost:5173'
  }

  // API routes

  // /api
  app.use(cors(corsOptions));
  app.use("/api", require("./steamRoutes.js"));

  // Serve frontend files
  app.use(express.static(path.join(__dirname, '../../dist'))); 

  // Catch-all route to serve frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });

  // Simple error handling middleware
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status ?? 500).send(err.message ?? "Internal server error.");
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
  });
};

createApp();
