/* **********************************************
 *   Modulo para las rutas de los pasatiempos   *
 ************************************************/

const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/1', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo1.html");
});

router.get('/2', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo2.html");
});

router.get('/3', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo3.html");
});

module.exports = router;