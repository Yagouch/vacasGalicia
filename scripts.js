const fondo = document.querySelector('.fondo');
const botonHigher = document.querySelector('.boton-higher');
const botonLower = document.querySelector('.boton-lower');

class municipio {

    constructor(id = 0, name = 'Desconocido', population = 0, year = 2022, cows = 0, more_people_than_cows = true) {
        this.id = id;
        this.name = name;
        this.population = population;
        this.year = year;
        this.cows = cows;
        this.more_people_than_cows = more_people_than_cows;
    }
    
    update(id, name, population, cows) {
        this.id = id;
        this.name = name;
        this.population = population;
        this.year = year;
        this.cows = cows;
        this.more_people_than_cows = more_people_than_cows;
    }


    toString() {
        return `${this.name} tiene ${this.population} habitantes y ${this.cows} vacas.`;
    }


    static from(json) {
        return Object.assign(new municipio(), json);
    }

}

let places = [];
let data_personas = [];
let data_vacas = [];

async function fetchUserData(){
    try {
        const response = await fetch('./datasets/analyzed.json');
        if (!response.ok) {
            throw new Error('The requests failed');
        }
        const raw_data = await response.json();
        for (let i = 0; i < raw_data.length; i++) {
            let place = municipio.from(raw_data[i]);
            if(place.more_people_than_cows){
                data_personas.push(place);
            } else data_vacas.push(place);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function nextPlace() {
    let randomPlace;
    if (places.length == 0) {
        randomPlace = data_personas[Math.floor(Math.random() * data_personas.length)];
    } else {
        if (places[places.length - 1].more_people_than_cows == true){
            randomPlace = Math.random() < 0.6 ? data_vacas[Math.floor(Math.random() * data_vacas.length)] : data_personas[Math.floor(Math.random() * data_personas.length)];
        } else randomPlace = Math.random() < 0.4 ? data_vacas[Math.floor(Math.random() * data_vacas.length)] : data_personas[Math.floor(Math.random() * data_personas.length)];
    }
    places.push(municipio.from(randomPlace));
}

function generarColorAleatorio() {
    const colores = ["#4B5945", "#66785F", "#504B38", "#7A6F5D", "#2A3663"];
        return colores[Math.floor(Math.random() * (colores.length - 1))];
}

function resetFondo(color) {
    document.body.style.backgroundColor = color;
    fondo.classList.remove('active');
    document.querySelector('#question').textContent = '¿Qué hay más?';
}

function cambiarFondo() {
    
    nextPlace();

    setTimeout(function(){
        const nuevoColor = generarColorAleatorio();
        fondo.style.backgroundColor = nuevoColor;
        fondo.classList.add('active');
        setTimeout(() => resetFondo(nuevoColor), 1000);
    },500);
    setTimeout(function(){
        document.querySelector('.city').textContent = places[places.length - 1]['name'];
        document.querySelector('#info').textContent = places[places.length - 1].toString();
    },1400);
}

function resetJuego() {
    setTimeout(function(){
        document.querySelector('#question').textContent = '¡Vuelve a intentarlo!';
        document.querySelector('.city').textContent = places[places.length - 1]['name'];
        document.querySelector('#info').textContent = places[places.length - 1].toString();
    },500);
}

function validarRespuesta(tipo) {
    let acierto = false;
    console.log(places);

    if(tipo == 2 && Number(places[places.length - 1].population) > Number(places[places.length - 1].cows)){
        acierto = true;
    } else if(tipo == 1 && Number(places[places.length - 1].population) <= Number(places[places.length - 1].cows)){
        acierto = true;
    } else {
        acierto = false;
    }

    if(acierto){
        document.querySelector('#question').textContent = '¡Correcto!';
        cambiarFondo();
    } else {
        document.querySelector('#question').textContent = '¡Incorrecto!';
        resetJuego();
    }

}

async function play(){
    places = [];
    await fetchUserData();
    nextPlace();
    setTimeout(function(){
        const nuevoColor = generarColorAleatorio();
        fondo.style.backgroundColor = nuevoColor;
        fondo.classList.add('active');
        setTimeout(() => resetFondo(nuevoColor), 1000);
    },300);
    setTimeout(function(){
        document.querySelector('#city').textContent = places[places.length - 1]['name'];
        document.querySelector('#info').textContent = places[places.length - 1].toString();
    },1400);
}

function loadPage(page, index = false) {
    if (!index) {
        play();   
    } else {
        setTimeout(function(){
            fondo.style.backgroundColor = "#3498db";
            fondo.classList.add('active');
            setTimeout(() => resetFondo("#3498db"), 1000);
        },500);
    }

    setTimeout(() => fetch(page)
    .then(response => response.text())
    .then(data => {
        const content = document.getElementById("container");
        if (content) {
            content.innerHTML = data;
        } else {
            console.error("Elemento #container no encontrado en el DOM.");
        }
    })
    .catch(error => console.error("Error al cargar la página:", error)) , 1200);
    
}


