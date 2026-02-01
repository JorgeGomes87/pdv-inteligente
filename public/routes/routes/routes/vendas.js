import express from "express";
import { criarVenda } from "../controllers/vendasController.js";

const router = express.Router();
router.post("/", criarVenda);

export default router;
