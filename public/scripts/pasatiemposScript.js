
var HINT_QTY = 3;
var dictionary;
var resuelto = false;

async function inicio() {

    var tableInputs = document.getElementsByClassName("tableInputs");

    for(let i = 0; i<tableInputs.length; i++){

        /* Evento para no permitir que se escriba mas de una letra*/
        tableInputs[i].addEventListener("keypress", function(evt) {

            if(this.innerHTML.length >= this.getAttribute("max")){
                evt.preventDefault();
                return false;
            }

        }, false);

        //Para chequear el input
        tableInputs[i].addEventListener("input", function(evt) {

            if(!(/[A-Za-zÑñÁáÉéÍíÓóÚúÜü]/).test(this.innerText)){
                this.innerText ="";
                return false;
            }
            this.innerText = this.innerText.toUpperCase();

            //Poner el cursor al final
            this.focus();
            document.execCommand('selectAll', false, null);
            document.getSelection().collapseToEnd();
        }, false);

        //Para checkear la palabra si se completa
        tableInputs[i].addEventListener("input", function(evt) {

            var elemClass = this.className.split(" ")[1];
            var elemsFila = document.getElementsByClassName(elemClass);
            var palabra = "";
            var i = 0;

            while(i<elemsFila.length){
                if(elemsFila[i].innerHTML==="") return;
                palabra += elemsFila[i].innerHTML;
                i++;
            }

            var pal = {
                'fila': 'n',
                'palabra': palabra
            }
            //Envio peticion al servidor para comprobar si la palabra se encuentra en el diccionario
            serverRequest(pal, '/check/checkPasatiempo/fila', (response) =>{
                if(response!="Exists") alert("La palabra "+palabra+" no existe!!!");
            });


        }, false);

    }
    updateHints();
    await loadCookies();
}

function updateHints(){

    serverRequest({}, '/check/updatePistas', (response)=>{
        document.getElementById("remainingHints").innerHTML=JSON.parse(response);
    });
}
function saveCookies(){

    if(confirm("Todos los datos existentes se sobreescribiran, ¿desea continuar?")){
        var cells = document.getElementsByClassName("tableInputs");
        for(var i in cells){
            localStorage.setItem('cell'+i, cells[i].innerHTML);
        }
        localStorage.setItem('pistas', HINT_QTY);
    }

}

async function loadCookies(){

    var cells = document.getElementsByClassName("tableInputs");
    for(var i in cells){
        cells[i].innerHTML = localStorage.getItem('cell'+i);
    }
    var pistasLocal = localStorage.getItem('pistas');
    if(pistasLocal) HINT_QTY = pistasLocal;
}

function cleanCookies(){

    if(confirm("Todos los datos existentes se borraran y serán irrecuperables, ¿desea continuar?")){
        var cells = document.getElementsByClassName("tableInputs");
        for(var i in cells){
            localStorage.setItem('cell'+i, '');
        }
        localStorage.setItem('pistas', 3);
    }
}

function restartGame(){

    if(confirm("El tablero se vaciará y se borraran los datos locales, ¿desea continuar?")){

        serverRequest({}, '/check/resetPistas', (response)=>{
        });
        updateHints();
        cleanCookies();
        
        //Limpiar tablero
        var cells = document.getElementsByClassName('tableInputs');
        for(let c of cells){
            c.innerHTML ="";
        }

        document.getElementById('containedLetters').innerHTML="";
        document.getElementById('hintArea').innerText = "";
        document.getElementById('letrasPistas').value = "";
    }
}

async function giveHint(){

    var hint = checkAndFormatHintInput(document.getElementById('letrasPistas').value);
    if(!hint) return alert("¡Petición de piista inválida! SEPARAR POR COMAS LAS LETRAS");

    var pista = {
        'pista': hint
    }

    serverRequest(pista, '/check/darPista', (response)=>{
        if(response=="No quedan pistas") return alert("¡No te quedan pistas!");
        document.getElementById('hintArea').innerHTML=response;
    });
    
    serverRequest(pista, '/check/updatePistas', (response)=>{
        document.getElementById("remainingHints").innerHTML=JSON.parse(response);
    });
}

function checkAndFormatHintInput(hint){

    var hintF = hint.replace(/\s+/g, ''); //Eliminar espacios
    if(! ((/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü,]+$/).test(hintF)) ) return false; //Si contiene caracteres diferentes de letras o el separador
    return hintF.split(",");
}

//NUEVO
async function serverRequest(data, url, _callback){
    
    var peticion = new XMLHttpRequest();
    peticion.addEventListener('load', ()=>{
        _callback(peticion.responseText);
    });
    peticion.open("POST", url);
    peticion.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    peticion.send(JSON.stringify(data));

}

async function checkPasatiempo(num){
    
    var filas =[];
    var fila = "";
    var claseAnterior;
    var tableInputs = document.getElementsByClassName("tableInputs");
    claseAnterior = tableInputs[0].classList[1];

    for(let cell of tableInputs){
        if(cell.textContent=="") return alert("¡El pasatiempo no está completo!");

        if(cell.classList[1]==claseAnterior){
            fila = fila+cell.textContent;
        }else{
            filas.push(fila);
            fila = cell.textContent;
        }
        claseAnterior=cell.classList[1];
    }
    
    filas.push(fila);
    var pasatiempo = {
        'pasatiempo': JSON.stringify(filas),
        'pasNum': num
    }
    
    serverRequest(pasatiempo, '/check/checkPasatiempo', (response)=>{

        if(response=="correcto")
            document.getElementById('spanResuelto').innerHTML="Si.";
        else
            document.getElementById('spanResuelto').innerHTML="No.";
    });
}