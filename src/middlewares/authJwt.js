const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const Role = require('../models/Role')
const User = require('../models/User')


verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  };

  
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user.user_type === "ADMIN") {
        next();
        return;
      }
      res.status(403).send({ message: "Require Admin Role!" });
                return;

    });
  };

isSeller = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user.user_type === "SELLER") {
      next();
      return;
    }
    res.status(403).send({ message: "Require Seller Role!" });
              return;

  });
};

isBuyer = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user.user_type === "BUYER") {
      next();
      return;
    }
    res.status(403).send({ message: "Require Buyer Role!" });
              return;

  });
};

  const authJwt = {
    verifyToken,
    isAdmin,
    isSeller,
    isBuyer
  };
  module.exports = authJwt;