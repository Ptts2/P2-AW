/* **********************************************
 *     Modulo para analizar los pasatiempos     *
 ************************************************/

const express = require('express');
const path = require('path');
const extRequest = require('./externalRequests');
const router = express.Router();
var dictionary = "";

//Peticion para el diccionario
const dictReq = {
    host: 'ordenalfabetix.unileon.es',
    port: 443,
    path: '/aw/diccionario.txt',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
};

extRequest.getJSON(dictReq, async (status, result)=>{
    dictionary = result;
});


//Funciones locales
function checkInput(palabra){
    if(!(/[A-Za-zÑñÁáÉéÍíÓóÚúÜü]/).test(palabra)){
        return false;
    }
    return true;
}   

function checkWord(palabra){

    //Compruebo  el input  
    if(!checkInput(palabra)){
        return "Bad Input";
    }

    //Compruebo si esta en el diccionario
    if(!dictionary.includes(palabra.toLocaleLowerCase())){
        //No está en el diccionario
        return "Does not exist";
    }
    //Si esta correctamente resuelto
    return "Exists";

}

router.get('/checkPasatiempo', (req, res)=>{
    console.log("Peticion GET");
    res.send("Te respondo GET");
});

router.post('/checkPasatiempo', (req, res)=>{

    //Comprobar el pasatiempo
    var pasatiempo = req.body; //Array con numero de filas del pasatiempo

    //Compruebo si las solciones son las del pasatiempo y las palabras en el diccionario

    //Si esta correctamente resuelto
    res.send("correcto");

    //Si no
    res.send("no");

});

/**
 * Funcion que comprueba que las filas sean correctas (que pertenezcan al diccionario)
 */
router.post('/checkPasatiempo/fila', (req, res)=>{

    var numFila = req.body.fila; //Numero de la fila a comprobar
    var fila = req.body.palabra; //Palabra a comprobar

    res.send(checkWord(fila));
});


module.exports = router;