require('dotenv').config();

// Express initialization
const express = require("express");
const app = express();
app.use(express.json());


// Create endpoints
const createEndpoints = require('./routes/usersRoute.js');
createEndpoints(app);


// Start server
app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto " + process.env.PORT)
});