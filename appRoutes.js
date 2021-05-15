/* **********************************************
 *   Modulo para las rutas de los pasatiempos   *
 ************************************************/

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

app.use('/pasatiempos', express.static('public'));

router.get('/1', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo.html");
});

router.get('/2', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo.html");
});

router.get('/3', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo.html");
});

module.exports = router;