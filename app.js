//npx json-server --watch db.json --port 3001 para iniciar servidor 
//con mokapi usar https://673ad896339a4ce445195433.mockapi.io/glosario/api/1/palabras



const contenedorPalabras = document.getElementById('palabras');
const formulario = document.getElementById('formulario');
const botonAgregar = document.getElementById('formulario_btn_enviar');
const espanol="";
let lastId = 0;

//funcion para agregar palabra al html
function agregarPalabraAlHTML(palabras){
    const palabrasHTML = `
    <div class="palabras__card" data-id="${palabras.id}">
        <img src="${palabras.imagen}" alt="${palabras.español}">
        <p class="palabra__español">${palabras.español}</p>
        <div class="card__palabras__info">
            <h3 class="palabra__aleman">${palabras.aleman}</h3>
            <button class="boton__borrar" onclick="eliminarPalabra(${palabras.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </div>
    `;
    contenedorPalabras.insertAdjacentHTML('beforeend', palabrasHTML);
}




//Cargamos las palabras
fetch("https://673ad896339a4ce445195433.mockapi.io/glosario/api/1/palabras")
.then(response=>{
    if(!response.ok){
        throw new Error('Error al cargar las palabras')
    }
    return response.json();
})
.then(data =>{
    // Establecemos el último id
    lastId = data.reduce((maxId, palabras) => Math.max(maxId, palabras.id), 0);
        
    // Agregamos las palabras al HTML
    data.forEach(palabras => {
        agregarPalabraAlHTML(palabras);
});
})
.catch(error => {
    console.log('Error al hacer fetch', error);
});

//Evento para agregar una nueva palabra

botonAgregar.addEventListener('click', (event)=>{
    event.preventDefault();

    const español = document.getElementById('formulario_palabra_esp').value;
    const aleman = document.getElementById('formulario_palabra_alem').value;
    const imagen = document.getElementById('formulario_imagen').value;
    if (!español || !aleman || !imagen) {
        const mensajeError = document.getElementById('mensaje-error');
        mensajeError.textContent = 'Por favor, completa todos los campos.';
    
        // Temporizador para borrar el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeError.textContent = '';
        }, 2000);
    
        return;
    }
    
    
    

    //Crear nueva palabra sin el id ya que el JSON server lo asignara automatico
    const nuevaPalabra ={
        id:(lastId + 1).toString(),
        español,
        aleman,
        imagen
    };
    lastId++;

    fetch('https://673ad896339a4ce445195433.mockapi.io/glosario/api/1/palabras',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaPalabra),
    })
    .then(response=>{
        if(!response.ok){
            throw new Error('Error al agregar la palabra')
        }
        return response.json();
    })
    .then(data=>{
        console.log('Palabra agregada', data);
        agregarPalabraAlHTML(data);
        formulario.reset();
    })
    .catch(error=>{
        console.log('Error al agregar la palabra: ', error);
    });
});




// Función para eliminar una palabra
function eliminarPalabra(id) {
    console.log("ID del palabra a eliminar:", id);
    fetch(`https://673ad896339a4ce445195433.mockapi.io/glosario/api/1/palabras/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la palabra');
        }
        const palabrasCard = document.querySelector(`.palabras__card[data-id="${id}"]`);
        if (palabrasCard) {
            palabrasCard.remove();
        }
    })
    .catch(error => {
        console.log('Error al eliminar la palabra', error);
    });
}
const mensajeSinResultados = document.getElementById('sin-resultados');

document.getElementById('btn-buscar').addEventListener('click',()=>{
    const query = document.getElementById('buscar-palabra').value.toLowerCase();
    const tarjetas = document.querySelectorAll('.palabras__card');

    let resultados =0;

    tarjetas.forEach(card =>{
        const palabrasEsp = card.querySelector('p').textContent.toLowerCase();
        const palabrasAle = card.querySelector('h3').textContent.toLowerCase();

        if(palabrasEsp.includes(query) || palabrasAle.includes(query)){
            card.style.display='block';
            resultados++;
        }else{
            card.style.display ='none'
        }
    });
    if (resultados === 0) {
        mensajeSinResultados.style.display = 'block';
    } else {
        mensajeSinResultados.style.display = 'none';
    }
});

document.getElementById('buscar-palabra').addEventListener('input', () => {
    document.getElementById('btn-buscar').click();
});
