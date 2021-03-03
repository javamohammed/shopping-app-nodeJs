const express = require('express')
const controller = require('../controllers/seller')
const { verifyToken, isSeller } = require("../middlewares/authJwt");

const route = express.Router()

route.get("/seller/",[verifyToken, isSeller], controller.getSellerIndex)
module.exports = route