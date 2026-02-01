import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/login", async (req,res)=>{
  const { email, senha } = req.body;
  const [user] = await db.query("SELECT * FROM usuarios WHERE email=?", [email]);
  if(!user.length) return res.status(401).send("Usuário não encontrado");

  const ok = await bcrypt.compare(senha, user[0].senha);
  if(!ok) return res.status(401).send("Senha inválida");

  const token = jwt.sign({id:user[0].id}, "segredo");
  res.json({ token });
});

export default router;
