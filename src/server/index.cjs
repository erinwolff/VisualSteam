require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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
  app.use("/api", require("./steamRoutes.cjs"));
  

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
