const fondo = document.querySelector('.fondo');
const botonHigher = document.querySelector('.boton-higher');
const botonLower = document.querySelector('.boton-lower');

class municipio {

    constructor(id = 0, name = 'Desconocido', population = 0, cows = 0) {
        this.id = id;
        this.name = name;
        this.population = population;
        this.cows = cows;
    }
    
    update(id, name, population, cows) {
        this.id = id;
        this.name = name;
        this.population = population;
        this.cows = cows;
    }


    toString() {
        return `${this.id}: ${this.name} tiene ${this.population} habitantes y ${this.cows} vacas.`;
    }

}

let Place = new municipio();

async function fetchUserData(){
    // fetch('population.json')
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     let randomPlace = data[Math.floor(Math.random() * data.length)];
    //     Place.update(randomPlace.id, randomPlace.name, randomPlace.population);
    //     console.log('Datos actualizados: ' + Place.toString());
    // })
    // .catch(error => {
    //     console.error('There was a problem with the fetch operation:', error);
    // });
    try {

        const [response1, response2] = await Promise.all([
            fetch('population.json'),
            fetch('cows.json')
        ]);

        if (!response1.ok || !response2.ok) {
            throw new Error('One or both requests failed');
        }

        const data1 = await response1.json();
        const data2 = await response2.json();

        // Hay que hacer que tenga en cuenta lo previamente mostrado para que no se repita

        let randomPlace = data1[Math.floor(Math.random() * data1.length)];
        let randomPlaceCows = data2.find(place => place.id === randomPlace['id'])['cows'];
        Place.update(randomPlace.id, randomPlace.name, randomPlace.population, randomPlaceCows);
        console.log(Place.toString());
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function generarColorAleatorio() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
}

function resetFondo(color) {
    document.body.style.backgroundColor = color;
    fondo.classList.remove('active');
}

function cambiarFondo() {
    botonHigher.disabled = true;
    botonLower.disabled = true;
    
    fetchUserData();

    setTimeout(function(){
        const nuevoColor = generarColorAleatorio();
        fondo.style.backgroundColor = nuevoColor;
        fondo.classList.add('active');
        setTimeout(() => resetFondo(nuevoColor), 1000);
    },500);
    setTimeout(function(){
        botonHigher.disabled = false;
        botonLower.disabled = false;
        document.querySelector('.city').innerHTML = Place['name'];
        document.querySelector('#info').innerHTML = Place.toString();
    },1400);
}

function play(){
    setTimeout(function(){
        const nuevoColor = generarColorAleatorio();
        fondo.style.backgroundColor = nuevoColor;
        fondo.classList.add('active');
        fetchUserData();
        setTimeout(() => resetFondo(nuevoColor), 1000);
    },500);
    setTimeout(function(){
        document.querySelector('.boton-higher').classList.add('active');
        document.querySelector('.boton-lower').classList.add('active');
        document.querySelector('.boton-play').classList.add('active');
        document.querySelector('.second-question').classList.add('active');
        document.querySelector('#question').innerHTML = '¿Qué hay más?';
        document.querySelector('.city').innerHTML = Place['name'];
        document.querySelector('#info').innerHTML = Place.toString();
    },1400);
}