/* **********************************************
 *     Modulo para analizar los pasatiempos     *
 ************************************************/

const express = require('express');
const path = require('path');
const extRequest = require('./externalRequests');
const router = express.Router();
var dictionary = "";
const pasatiemposResueltos =[
    ["CLAN", "PENA", "REMATO", "TORERO"],
    [],
    []
];

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
    dictionary = result.split("\n"); 
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

router.post('/checkPasatiempo', (req, res)=>{

    //Comprobar el pasatiempo
    var pasatiempo = JSON.parse(req.body.pasatiempo); //Array con numero de filas del pasatiempo
    var palabrasClave = [pasatiempo[0], pasatiempo[5], pasatiempo[6], pasatiempo[11]];
    var pasatiempoNum = req.body.pasNum;

    //Compruebo si las palabras del pasatiempo están en el diccionario
    for(let c in pasatiempo){
        if(checkWord(c)!="Exists"){
            res.send("Incorrecto");
            return;
        }
    }
    //Compruebo si las soluciones son las correctas
    for(let i of palabrasClave){
        if(pasatiemposResueltos[pasatiempoNum][i] != palabrasClave[i]){
            res.send("Incorrecto");
            return;
        }
    }
    //Si esta correctamente resuelto
    res.send("correcto");
    return;

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