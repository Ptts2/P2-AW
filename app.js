
//Modulos
const http = require('http');
const express = require('express');
const app = express();

const pasatiempos = require('./appRoutes.js');
const PORT = 5050;

//Pagina principal - seleccion de pasatiempos
app.use(express.static('public'));

//Paginas de los pasatiempos
app.use('/pasatiempos', pasatiempos)


//Inicio de la app
app.listen(PORT, ()=>{
    console.log('Servidor en la url http://127.0.0.1:'+PORT+'/');
});
