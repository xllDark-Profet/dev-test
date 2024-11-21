import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { token } from "morgan";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { username, rol, email, password } = req.body;
  if (!["admin", "client"].includes(rol)) {
    return res.status(400).json({ message: "Rol invalido, debe ser admin o client." });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      rol,
      email,
      password: passwordHash,
    });
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      message: "Usuario creado exitosamente",
      user_id: userSaved._id,
      user_name: userSaved.username,
      rol: userSaved.rol,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contrasena incorrecta" });
    }
    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token);
    res.json({
      message: "Se ha iniciado sesion exitosamente",
      user_id: userFound._id,
      user_name: userFound.username,
      rol: userFound.rol,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.status(200).json({message: "Se ha cerrado sesion exitosamente"});
};

export const profile = async (req, res) =>{
    const userFound = await User.findById(req.user.id);
    if(!userFound){
        return res.status(400).json({message: "Usuario no encontrado"});
    }
    return res.json({
        user_id: userFound._id,
        user_name: userFound.username,
        rol: userFound.rol,
        email: userFound.email,
    });
};