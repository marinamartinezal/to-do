import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { leerTareas,crearTarea,borrarTarea,editarEstado,editarTarea } from "./db.js";

const servidor = express();

servidor.use(cors());

servidor.use(express.json());

if(process.env.PRUEBAS){
    servidor.use("/pruebas",express.static("./pruebas"));
}

servidor.get("/tareas", async (peticion,respuesta) => {
    try{

        let tareas = await leerTareas();

        respuesta.json(tareas);
        

    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }
});

servidor.post("/tareas/nueva", async (peticion,respuesta,siguiente) => {

    let {tarea} = peticion.body;
    if(tarea != undefined){
        tarea = tarea.toString();
    }

    let valido = tarea !=undefined && tarea.trim() != ""; 

    if(valido){

        try{

            let id = await crearTarea(tarea);

            return respuesta.json({id});

        }catch(error){

            respuesta.status(500);

            respuesta.json({ error : "error en el servidor" });

        }
      
    }

    siguiente(true);
});

servidor.delete("/tareas/borrar/:id([0-9]+)",async (peticion,respuesta,siguiente) => {
    try{

        let count = await borrarTarea(peticion.params.id);

        if(count){
            respuesta.status(204);
            return respuesta.send("");
        }

        siguiente();

    }catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }
});

servidor.put("/tareas/editar/texto/:id([0-9]+)", (peticion,respuesta) => {
    respuesta.send("PUT /tareas/editar/texto/:id");
});

servidor.put("/tareas/editar/estado/:id([0-9]+)", async (peticion,respuesta) => {
   
    let {tarea} = peticion.body;
    if(tarea != undefined){
        tarea = tarea.toString();
    }

    let valido= tarea !=undefined && tarea.trim() != "";
   
    try{

        let count = await editarEstado(peticion.params.id);

        if(count){
            respuesta.status(204);
            return respuesta.send("");
        }

        siguiente();

    }catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la petición" });
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado" });
});


servidor.listen(process.env.PORT);
