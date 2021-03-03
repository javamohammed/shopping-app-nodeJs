const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require("cors");

//Locals dependencies
const usersRoutes = require('./src/routes/users')
const adminRoutes = require('./src/routes/admin')
const sellerRoutes = require('./src/routes/seller')
const buyerRoutes = require('./src/routes/buyer')

const corsOptions = {
    origin: "http://localhost:3001"
  };

const app = express()
const MONGODB_URI = `mongodb://localhost:27017/shopping`

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }))
 
app.use(cors(corsOptions));


//routes
app.use(usersRoutes)
app.use(adminRoutes)
app.use(sellerRoutes)
app.use(buyerRoutes)


app.get('/',(req, res, next) => {
    return res.send("Hello!!!")
})

//app.get('/*', publicController.get404)
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log("Server and Mongo_DB are running in this port " + 3000 + "...")
    app.listen(3000)
}).catch( err => {
    console.log(err)
});