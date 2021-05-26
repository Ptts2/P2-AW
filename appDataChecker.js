/* **********************************************
 *     Modulo para analizar los pasatiempos     *
 ************************************************/

const express = require('express');
const path = require('path');
const extRequest = require('./externalRequests');
const router = express.Router();
var dictionary = "";
var pistas = 3;
const pasatiemposResueltos =[
    ["CLAN", "PENA", "REMATO", "TORERO"],
    ["VACA", "ROCA", "ESTADO", "VENADO"],
    ["VELA", "TELA", "CALCIO", "COLEGA"]
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
    for(let c of pasatiempo){
        if(checkWord(c)!="Exists"){
            res.send("Incorrecto");
            return;
        }
    }
    //Compruebo si las soluciones son las correctas
    for(let i in palabrasClave){
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

router.post('/darPista', (req, res)=>{

    if(pistas==0) {
        res.send("No quedan pistas");
        return;
    }

    var hint = req.body.pista;

    var letrasContenidas ="";
    for(letra of hint){
        letrasContenidas += letra+", ";
    }
    letrasContenidas = letrasContenidas.substring(0,letrasContenidas.length-2);
    //document.getElementById('containedLetters').innerHTML=letrasContenidas;

    var palabrasEncajan ="";
    for(word of dictionary){

        var included = true;
        for(letter of hint){
            if(!word.includes(letter)){
                included = false;
                break;
            }
        }
        if(included){
            palabrasEncajan+= word + "\n";
        }
    }
    if(palabrasEncajan=="") palabrasEncajan = "No existen palabras que contengan esas letras";
    pistas--;

    res.send(palabrasEncajan);

});

router.post('/updatePistas', (req, res)=>{
    res.send(pistas.toString());
});


router.post('/resetPistas', (req, res)=>{
    pistas=3;
});

module.exports = router;