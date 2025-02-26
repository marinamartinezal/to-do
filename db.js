import dotenv from "dotenv";
dotenv.config();
import postgres from "postgres";

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        port : process.env.DB_PORT
    });
}

export function leerTareas(){
    return new Promise((ok,ko) => {
        const conexion = conectar();

        conexion`SELECT * FROM tareas ORDER BY id`
        .then( tareas => {
            conexion.end();
            ok(tareas);
        })
        .catch(error => {
            console.log(error)
            conexion.end();
            ko({ error : "error en base de datos" });
        });
    });
}


export function crearTarea(tarea){
    return new Promise((ok,ko) => {
        const conexion = conectar();

        conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`
        .then( ([{id}]) => {
            conexion.end();
            ok(id);
        })
        .catch(error => {
            conexion.end();
            ko({ error : "error en base de datos" });
        });
    });
}


export function borrarTarea(id){
    return new Promise((ok,ko) => {
        const conexion = conectar();

        conexion`DELETE FROM tareas WHERE id = ${id}`
        .then( ({count}) => {
            conexion.end();
            ok(count);
        })
        .catch(error => {
            conexion.end();
            ko({ error : "error en base de datos" });
        });
    });
}


export function editarEstado(id){
    return new Promise((ok,ko) => {
        const conexion = conectar();

        conexion`UPDATE tareas SET estado = NOT estado WHERE id = ${id}`
        .then( ({count}) => {
            conexion.end();
            ok(count);
        })
        .catch(error => {
            conexion.end();
            ko({ error : "error en base de datos" });
        });
    });
}

export function editarTarea(id,tarea){
    return new Promise((ok,ko) => {
        const conexion = conectar();

        conexion`UPDATE tareas SET tarea = ${tarea} WHERE id = ${id}`
        .then( ({count}) => {
            conexion.end();
            ok(count);
        })
        .catch(error => {
            conexion.end();
            ko({ error : "error en base de datos" });
        });
    });
}
