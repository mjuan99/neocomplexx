require('dotenv').config()
const express = require("express")
const app = express()
const port = process.env.PORT

const fs = require("fs")
const jsPackacge = JSON.parse(fs.readFileSync("package.json"))

app.get('/health', (req, res) => {
    res.json({nombre: jsPackacge.name, version: jsPackacge.version})
})

app.listen(port, () => {
    console.log("Escuchando en el puerto " + port)
})