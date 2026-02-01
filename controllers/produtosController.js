import db from "../db.js";

export const listar = (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => res.json(rows));
};

export const criar = (req, res) => {
  const { nome, preco, estoque } = req.body;
  db.run(
    "INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)",
    [nome, preco, estoque],
    function () {
      res.json({ id: this.lastID });
    }
  );
};
