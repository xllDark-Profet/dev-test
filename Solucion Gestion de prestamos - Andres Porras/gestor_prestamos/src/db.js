import mongoose from "mongoose";

export const connectDB = async() =>{
    try{
        await mongoose.connect("mongodb://localhost/prestamosdb");
        console.log(">>>Conexion DB exitosa");

    }catch(error){
        console.log(error);
    }
};