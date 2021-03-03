const express = require('express')
const controller = require('../controllers/buyer')
const { verifyToken, isBuyer } = require("../middlewares/authJwt");

const route = express.Router()


route.get("/buyer/",[verifyToken, isBuyer], controller.getBuyerIndex)
module.exports = route