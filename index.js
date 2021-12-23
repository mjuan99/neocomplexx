require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT;

const mysql = require('mysql2');
const con = mysql.createConnection({host: "localhost", user: "root", password: "root", database: "neocomplexx"});

con.connect(err => {
    if (err)
        console.log("Error al conectarse a la base de datos");
    else{
        app.get('/health', (req, res) => {
            con.query("SELECT * FROM registro", (err, result, fields) => {
                if (!err)
                    res.json({nombre: result[0].nombre, version: result[0].vers});
                else
                    res.send("Error de conexion")
            })
        });
        
        app.listen(port, () => {
            console.log("Escuchando en el puerto " + port)
        });
    }
})