import express from "express";
import "./db.js";

import produtos from "./routes/produtos.js";
import vendas from "./routes/vendas.js";
import caixa from "./routes/caixa.js";

const app = express();
app.use(express.json());

app.use("/produtos", produtos);
app.use("/vendas", vendas);
app.use("/caixa", caixa);

app.listen(3000, () => {
  console.log("🔥 PDV rodando em http://localhost:3000");
});
