var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require("./config/database");
var apiRouter = require('./routes/index');
const mongoose = require("mongoose");

var app = express();

//connect to cloud database
mongoose.connect(config.database);
//on conncetion 
mongoose.connection.on('connected', () => {
    console.log("connected to database: " + config.database);
});
//on error 
mongoose.connection.on('error', (err) => {
    console.log("err: " + err);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport middleware
//https://github.com/jaredhanson/passport/issues/244
const passport = require("passport");
const session = require("express-session");
app.use(cookieParser());
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());
require('./auth/auth')(passport);


app.use('/api', apiRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');
});*/


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("..", "client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve("..", "client", "build", "index.html"));
    });
} else if (process.env.NODE_ENV === "development") {
    var corsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
}

module.exports = app;