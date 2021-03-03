const express = require('express')
const controller = require('../controllers/admin')
const { verifyToken, isAdmin } = require("../middlewares/authJwt");
const route = express.Router()

route.get("/admin/",[ verifyToken, isAdmin ], controller.getAdminIndex)
module.exports = route