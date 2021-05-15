/* **********************************************
 *   Modulo para las rutas de los pasatiempos   *
 ************************************************/

const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/1', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo.html");
});

router.get('/2', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo.html");
});

router.get('/3', (req, res)=>{
    res.sendFile(__dirname + "/public/pasatiempos/pasatiempo.html");
});


//ELIMINAR DESPUES
router.get('/test', (req, res)=>{

    res.sendFile(__dirname + "/public/pasatiempos/test.html");
    
});

module.exports = router;