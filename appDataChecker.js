/* **********************************************
 *     Modulo para analizar los pasatiempos     *
 ************************************************/

const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/checkPasatiempo', (req, res)=>{
    
    //Comprobar para enlaces
    res.status(204).send();
});

router.post('/checkPasatiempo', (req, res)=>{

    //Comprobar para inputs
    res.status(204).send();
});

module.exports = router;


