
var HINT_QTY = 3;
var dictionary;
const respuestas = ["CLAN", "PENA", "REMATO", "TORERO"];

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

            if(!dictionary.includes(palabra.toLocaleLowerCase())){
                alert("La palabra "+palabra+" no existe!!!");
            }

            //Checkear que esta completo
            var cells = document.getElementsByClassName('tableInputs');
            var bienResuelto = false;
            var clasesFilas = ["fila1", "fila6", "fila7", "fila12"];

            var palabrasEnFilas =["","","",""];
            for(let cell of cells){
               if(cell.innerHTML===""){ 
                    document.getElementById('spanResuelto').innerHTML="No.";
                    return;
                }
                if(cell.className.split(" ")[1] == clasesFilas[0]){
                    palabrasEnFilas[0]+=cell.innerHTML;
                }
                if(cell.className.split(" ")[1] == clasesFilas[1]){
                    palabrasEnFilas[1]+=cell.innerHTML;
                }
                if(cell.className.split(" ")[1] == clasesFilas[2]){
                    palabrasEnFilas[2]+=cell.innerHTML;
                }
                if(cell.className.split(" ")[1] == clasesFilas[3]){
                    palabrasEnFilas[3]+=cell.innerHTML;
                }
            }

            if(palabrasEnFilas[0].toUpperCase() == respuestas[0] && palabrasEnFilas[1].toUpperCase() == respuestas[1] && palabrasEnFilas[2].toUpperCase() == respuestas[2] && palabrasEnFilas[3].toUpperCase() == respuestas[3])
                bienResuelto=true;
            
            if(bienResuelto) document.getElementById('spanResuelto').innerHTML="Si.";
            else document.getElementById('spanResuelto').innerHTML="No.";

        }, false);

    }
    await getDictionaryData('https://ordenalfabetix.unileon.es/aw/diccionario.txt');
    await loadCookies();
    updateHints();
}

function updateHints(used, qty){ 
    if(HINT_QTY === 0) return false;
    if(used) HINT_QTY--;
    document.getElementById("remainingHints").innerHTML=HINT_QTY;
    return true;
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
        HINT_QTY = 3;
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
    if(!updateHints(true)) return alert("¡No te quedan pistas!");
    
    var letrasContenidas ="";
    for(letra of hint){
        letrasContenidas += letra+", ";
    }
    letrasContenidas = letrasContenidas.substring(0,letrasContenidas.length-2);
    document.getElementById('containedLetters').innerHTML=letrasContenidas;

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
    document.getElementById('hintArea').innerHTML=palabrasEncajan;
    
}

function checkAndFormatHintInput(hint){

    var hintF = hint.replace(/\s+/g, ''); //Eliminar espacios
    if(! ((/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü,]+$/).test(hintF)) ) return false; //Si contiene caracteres diferentes de letras o el separador
    return hintF.split(",");
}

async function getDictionaryData(url){

    if(!dictionary){

        var peticion = new XMLHttpRequest();
        peticion.open('GET', url, true);
        peticion.onload =()=>{
            dictionary = peticion.responseText.split("\n");
        };
        peticion.send();
    }
}
