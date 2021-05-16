/* **********************************************
 *     Modulo para analizar los pasatiempos     *
 ************************************************/

const express = require('express');
const path = require('path');

const router = express.Router();


router.get('/checkPasatiempo', (req, res)=>{
    console.log("Peticion GET");
    res.send("Te respondo GET");
});

router.post('/checkPasatiempo', (req, res)=>{

    console.log(req.method);
    console.log(req.body);
    res.send("Te respondo POST");

});

module.exports = router;


