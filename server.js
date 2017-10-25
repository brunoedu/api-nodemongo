var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  User = require('./api/models/UserModel'), //created model loading here
  config = require('./api/config/config'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  bodyParser = require('body-parser');
  
require("./api/config/passport")(passport);  

mongoose.Promise = global.Promise;
mongoose.connect(config.database); 

app.use(passport.initialize()); 

// app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

var routesUser = require('./api/routes/UserRoutes'); //importing route
routesUser(app, passport); //register the route


app.listen(port);

console.log('RESTful API server started on: ' + port);