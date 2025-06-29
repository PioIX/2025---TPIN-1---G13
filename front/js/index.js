// Punto 1

async function traerClubes() {
    let response
    response = await fetch(`http://localhost:4000/clubes`, {
        method: "GET", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },

    })
    const clubes = await response.json();
    console.log(clubes)

    let tabla = ""
    for (let i = 0; i < clubes.length; i++) {
        tabla += `
            <tr>
                <td> ${clubes[i].nombre} </td>
                <td> ${clubes[i].cant_jugadores}</td>
                <td> ${clubes[i].tiene_colegio} </td>
                <td> ${clubes[i].id_club} </td>
                <td> ${clubes[i].año_fundacion} </td>
                <td> ${clubes[i].id_estadio} </td> 
            </tr>`
    }
    if (document.getElementById("Tabla") != undefined) {
        document.getElementById("Tabla").innerHTML += tabla;
    }
    else{
        return clubes
    }


}    

// Punto 2

async function postClub(datos) {
    let response
    response = await fetch(`http://localhost:4000/insertarclub`, {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    })
    console.log(response)
    let result = await response.json()
    console.log(result)
}

function obtenerDatos() {
    let datos = {
        id_club: getIdClub(),
        cant_jugadores: getCantidadJugadores(),
        tiene_colegio: getTieneColegio(),
        año_fundacion: getAñoFundacion(),
        id_estadio: getIdEstadio(),
        nombre: getNombre(),
    }
    console.log(datos)
    postClub(datos)
}

// Punto 3

async function EliminarClub(id) {
    let response
    response = await fetch(`http://localhost:4000/clubdelete`, {
        method: "DELETE", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id_club: id})
    })
    console.log(response)
    let result = await response.json()
    console.log(result)
}

async function llenarSelect() {
    let clubes = await traerClubes()
    console.log(clubes)
    let select = ``

    for (let i = 0; i < clubes.length; i++) {
        select += `<option value="${clubes[i].id_club}">${clubes[i].id_club}</option>`
    }

    document.getElementById("select").innerHTML += select
}
// 2

function ObtenerId() {
    let id = getId()
    EliminarClub(id)
}

// Punto 4

async function fetchModificarClub(id_club,cant_nueva) {
    let response = await fetch("http://localhost:4000/clubesput",
        {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ cant_jugadores: cant_nueva,id_club: id_club }) //El paremetro se tiene que llamar como lo espera el back en el body
        })
    let result = response.json()
    return result
}

async function llenarSelectclub() {
    let clubes = await traerClubes()

    let selectClub = ``
    for (let i = 0; i < clubes.length; i++) {
        selectClub += `<option>${clubes[i].cant_jugadores}</option>`
    }

    let select = ``
    for (let i = 0; i < clubes.length; i++) {
        select += `<option>${clubes[i].id_club}</option>`
    }
    document.getElementById("selectClub").innerHTML += selectClub
    document.getElementById("select").innerHTML += select
}

async function modificar() {
    let id_club = getId()
    let cant_nueva = getCantNueva()
    let respuesta = await fetchModificarClub(id_club,cant_nueva)
    return
}



async function fetchNombre(nombre) {
    let response
    response = await fetch(`http://localhost:4000/login`, {
        method: "GET", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: nombre})
    })
    console.log(response)
    let result = await response.json()
    console.log(result)
}


function envioUsuario() {
    let nombre
    nombre = getNombre()
    fetchNombre(nombre)
}

// -------------------------------------------------------------------------------TP MITAD DE AÑO-------------------------------------------


let idLogged = -1  

// LOGIN  !!!!!!!!!!!
async function existsUser (nombre,password) { 
    try {
        const respuesta = await fetch(`http://localhost:4001/usuarioExiste`, {
            method: "POST", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({usuario: nombre, contraseña: password}),    
        })
        let result = await respuesta.json()
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
    }
}

async function conseguirID(nombre) {
    try {
        const respuesta = await fetch(`http://localhost:4001/conseguirId`, {
            method: "POST", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({usuario: nombre})
    
        })
        let result = await respuesta.json()
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
    }
}

async function esAdmin(nombre) {
    try {
        const respuesta = await fetch(`http://localhost:4001/esAdmin`, {
            method: "POST", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({usuario: nombre})
    
        })
        let result = await respuesta.json()
        console.log(result)
        if (result.length > 0) {
            return result[0].es_admin; // ✅ devolvemos solo el número
        } else {
            return null; // o null, según cómo quieras manejar errores
        }
    } catch (error) {
        console.log(error)
    }
}

async function login() {
    try {
        let nombre = ui.getUser(); 
        let password = ui.getPassword();
        let resultado = await existsUser(nombre, password) 
        console.log(resultado)
        if (resultado.length > 0) {  // SEGUIR SISTEMA DE LENGHT PARA USUARIOS
            idLogged = await conseguirID(nombre);
            console.log(idLogged)
            let admin = await esAdmin(nombre)
            console.log(admin)
            if (admin > 0) {
                ui.clearLoginInputs()
                console.log("soy admin")
                console.log("USTED INGRESO AL JUEGO")
                ui.showModal("INGRESO")
                /*
                ui.setUser(nombre)
                ui.changeScreenAdmin()*/
            } else {
                ui.clearLoginInputs()
                console.log("no soy admin")
                console.log("USTED INGRESO AL JUEGO")
                ui.showModal("INGRESO")
    
                /*ui.setUser(nombre);
                ui.changeScreen();*/
            }
        } else {
            console.log("NO PUDO INGRESAR AL JUEGO")
            ui.clearLoginInputs()
            ui.showModal("Usuario o contraseña son incorrectos")
            idLogged = -1;
        }
    } catch (error) {
        console.log(error)
    }
}

// REGISTER !!!!!!!!!!!!

async function conseguirDatos(nombre, password) {
    try {
        let datos = {
            usuario: nombre,
            contraseña: password,
            puntaje: 0,
            tiempo: 0,
            es_admin: 0
        }
        console.log(datos)
        return datos
    } catch (error) {
        console.log(error)
    }
}

async function newuser(nombre, password) {
    try {
        let resultado = await existsUser(nombre, password)
        console.log(resultado)
        if (resultado.length == 0) {
                console.log("hola")
                let datos = await conseguirDatos(nombre, password)
                const response = await fetch(`http://localhost:4001/insertarUsuario`, {
                method: "POST", //GET, POST, PUT o DELETE
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos)
            })
            let result = await response.json()
            console.log(result)
            return 1
        } else {
                return -1;
            }
    } catch (error) {
        console.log(error)
    }
}
            
async function registrar() {
    try {
        let nombre = ui.getUser();
        let password = ui.getPassword()
        console.log(nombre, password)
        let creado = await newuser(nombre, password)
        if (creado > 0) {
            ui.clearLoginInputs()
            ui.showModal("Usuario creado, haga el login por favor")
        } else {
            ui.clearLoginInputs()
            ui.showModal("Usuario existente, cree uno con distinto usuario porfavor")
        }
    } catch (error) {
        console.log(error)
    }
}


// CERRAR SESION !!!!!!!!
function cerrarsesion(){
    if (confirm("¿Queres cerrar sesion?") == true) {
        idLogged = -1
        ui.clearLoginInputs()
        ui.changeScreen()
        ui.showModal("Cerraste sesion")
    } else {
        ui.showModal("Seguis en sesion")
    }
}



