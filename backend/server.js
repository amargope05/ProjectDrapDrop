const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const layoutRoutes = require("./routes/layoutRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dragdropdb";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => console.log("MongoDB connected"));

app.use("/api/layouts", layoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
