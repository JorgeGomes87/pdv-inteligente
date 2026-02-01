import db from "../db.js";

export const criarVenda = (req, res) => {
  const { itens, formaPagamento, valorPago } = req.body;

  let total = itens.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  let troco = null;
  if (formaPagamento === "dinheiro") {
    if (valorPago < total)
      return res.status(400).json({ erro: "Valor insuficiente" });
    troco = valorPago - total;
  }

  db.run(
    `INSERT INTO vendas (total, forma_pagamento, valor_pago, troco)
     VALUES (?, ?, ?, ?)`,
    [total, formaPagamento, valorPago ?? null, troco],
    function () {
      const vendaId = this.lastID;

      itens.forEach((item) => {
        db.run(
          `INSERT INTO itens_venda 
           (venda_id, produto_id, quantidade, preco)
           VALUES (?, ?, ?, ?)`,
          [vendaId, item.produtoId, item.quantidade, item.preco]
        );

        db.run(
          `UPDATE produtos SET estoque = estoque - ?
           WHERE id = ?`,
          [item.quantidade, item.produtoId]
        );
      });

      res.json({ vendaId, total, troco });
    }
  );
};
