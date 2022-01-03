require('dotenv').config();


// Express initialization
const express = require("express");
const app = express();
app.use(express.json());


// Sequelize initialization
const sequelizeController = require('./ORM/sequelizeControler').getInstance();
const projectInfo = sequelizeController.projectInfo


// Define endpoints
const userRoutes = require('./routes/usersRoutes')
app.use('/', userRoutes)

app.get('/health', async (req, res) => {
    try{
        const info = await projectInfo.findOne({attributes: ['nombre', 'vers']});
        res.status(200).send({nombre: info.dataValues.nombre, version: info.dataValues.vers});
    }
    catch(error){
        res.status(500).send("Database Connection Error");
    }
});


// Start server
app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto " + process.env.PORT)
});