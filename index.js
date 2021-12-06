const express = require("express")
const app = express()

const fs = require("fs")
const jsPackacge = JSON.parse(fs.readFileSync("package.json"))

app.get('/health', (req, res) => {
    res.json({nombre: jsPackacge.name, version: jsPackacge.version})
})

app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000")
})