var jwt = require("jsonwebtoken");
var config = require("../config/config");
function verifyToken(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });
  jwt.verify(token, config.secret, function(err, decoded) {
    var idOk = true;
    if(req.params.userId){
        idOk = (req.params.userId === decoded.id)?true:false;
    }
    if (err || !idOk)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;
