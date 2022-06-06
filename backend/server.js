const express = require("express");
// const notes = require("./data/notes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const noteRoute = require("./routes/noteRoute");
const { notFound, errorHandker } = require("./middlewares/errorMiddleware");
const path = require("path");

const app = express();
dotenv.config();

connectDB();
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is working, getting data in response");
// });

// app.get("/api/notes", (req, res) => {
//   res.json(notes);
// });

app.use("/api/notes", noteRoute);
app.use("/api/users", userRoute);

//------------- deployment ---------------

__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontent/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//------------- deployment ---------------

app.use(notFound);
app.use(errorHandker);

// app.get("/api/notes/:id", (req, res) => {
//   const note = notes.find((n) => n._id === req.params.id);
//   res.json(note);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
