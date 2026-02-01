router.get("/", async (req,res)=>{
  let filtro = "";
  if(req.query.v === "dia") filtro = "DATE(data)=CURDATE()";
  if(req.query.v === "semana") filtro = "YEARWEEK(data)=YEARWEEK(NOW())";
  if(req.query.v === "mes") filtro = "MONTH(data)=MONTH(NOW())";

  const [dados] = await db.query(`SELECT * FROM vendas WHERE ${filtro}`);
  res.json(dados);
});
