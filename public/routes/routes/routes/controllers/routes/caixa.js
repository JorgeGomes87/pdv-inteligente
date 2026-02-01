import express from "express";
import { resumo } from "../controllers/caixaController.js";

const router = express.Router();
router.get("/", resumo);

export default router;
