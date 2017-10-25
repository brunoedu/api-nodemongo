'use strict';


var mongoose = require("mongoose"),
  config = require("../config/config"),
  jwt = require("jsonwebtoken"),
  passport = require("../config/passport"),
  user = mongoose.model("Users");


exports.authenticate = function(req, res) {
  user.findOne({
    email: req.body.email
  }, function(err, user){
    if(err) res.status(500).send(err);

    if(!user){
      res.status(401).json({
        success: false,
        message: "Authentication failed. User not found."
      })
    }else{
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign({
            id: user._id,
            email: user.email,
            senha: user.senha
          }, config.secret, { 
            expiresIn: 10080 
          });
          res.json({
            success: true, 
            token: token 
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Authentication failed. Wrong password."
          });
        }
      });
    }
  })
};

exports.list_all_users = function(req, res) {
  user.find({}, function(err, user) {
    if (err)
      res.status(500).send(err);
    res.json(user);
  });
};


exports.create_an_user = function(req, res) {
  var new_user = new user(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.status(500).send(err);
    res.json(user);
  });
};


exports.read_an_user = function(req, res) {
  user.findById(req.params.userId, function(err, user) {
    if (err) res.status(500).send(err);

    res.json(user);
  });
};


exports.update_an_user = function(req, res) {  
  user.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.status(500).send(err);
    res.json(user);
  });
};


exports.delete_an_user = function(req, res) {
  user.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.status(500).send(err);
    res.json({ message: 'user successfully deleted' });
  });
};

var validateToken = function(token, res, retorno){
  if (!token) return res
      .status(401)
      .send({ auth: false, message: "No token provided." });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });    

    retorno(decoded);
  });
};

// var getToken = function(headers) {
//   if (headers && headers.authorization) {
//     var parted = headers.authorization.split(" ");
//     if (parted.length === 2) {
//       return parted[1];
//     } else {
//       return null;
//     }
//   } else {
//     return null;
//   }
// };