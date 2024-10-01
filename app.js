const connectToMongoDB = require("./db/connectDB");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const route = require("./routes");
const dotenv = require("dotenv");
const cors = require("cors");
const { app } = require("./socket/socket");
const setupSwagger = require("./utils/swagger");
dotenv.config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000"], // Add any other origins as needed
    methods: ["GET", "POST"],
    credentials: true, // Add this line to allow cookies to be sent with the request
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
setupSwagger(app);
route(app);
connectToMongoDB();
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
