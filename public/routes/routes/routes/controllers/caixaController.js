import db from "../db.js";

export const resumo = (req, res) => {
  db.all(
    `
    SELECT 
      forma_pagamento,
      SUM(total) as total
    FROM vendas
    GROUP BY forma_pagamento
    `,
    [],
    (err, rows) => res.json(rows)
  );
};
