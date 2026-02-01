const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

// Executa a inicialização imediatamente
inicializarBanco();

  // Exportação explícita
        module.exports = { 
            abrirBanco: abrirBanco 
        };
/**
 * Função para abrir a conexão com o banco de dados.
 * Usaremos o arquivo 'distribuidora.db' que já existe na sua pasta.
 */
async function abrirBanco() {
    try {
        return await open({
            filename: path.join(__dirname, 'distribuidora.db'),
            driver: sqlite3.Database
        });
    } catch (error) {
        console.error("❌ Erro ao abrir conexão com o banco:", error);
        throw error;
    }
}
async function cadastrarProduto() {


const nome = nomeProd.value;
const preco = Number(precoProd.value);
const cat = catProd.value;
    
    if (!nome || !preco) return alert("Preencha tudo!");
    
    await fetch(`${API}/produtos`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome, preco, cat })
    });
    
    alert("Produto cadastrado!");
    carregarProdutos();
}

function mostrarSecao(sec) {
    document.querySelectorAll("section").forEach(s => s.style.display = "none");
    document.getElementById("sec-" + sec).style.display = "block";
}

import PDFDocument from "pdfkit";

router.get("/pdf", async (req,res)=>{
  const doc = new PDFDocument();
  res.setHeader("Content-Type","application/pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Relatório de Vendas", {align:"center"});
  const [vendas] = await db.query("SELECT * FROM vendas");

  vendas.forEach(v=>{
    doc.text(`Data: ${v.data} | Total: R$ ${v.total}`);
  });

  doc.end();
});


/**
 * Inicializa as tabelas se não existirem e insere dados iniciais.
*/
async function inicializarBanco() {
    let db;
    try {
        db = await abrirBanco();
        
        // Criar tabela de produtos
        await db.exec(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco REAL NOT NULL,
                estoque INTEGER DEFAULT 0
                )
                `);
                
                // Criar tabela de vendas
                await db.exec(`
                    CREATE TABLE IF NOT EXISTS vendas (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        data TEXT NOT NULL,
                        total REAL NOT NULL,
                        metodo_pagamento TEXT NOT NULL
                        )
                        `);
                        
                        // Verificar se precisa de dados iniciais
                        const produtos = await db.all('SELECT * FROM produtos LIMIT 1');
                        if (produtos.length === 0) {
                            console.log("📌 Banco vazio. Populando dados iniciais...");
            await db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', ['Cerveja Heineken 330ml', 9.99, 50]);
            await db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', ['Coca-Cola 2L', 12.00, 30]);
            await db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', ['Cerveja Brahma 350ml', 5.50, 100]);
        }
        
        console.log("✅ Banco de dados pronto para uso.");
    } catch (error) {
        console.error("❌ Erro ao inicializar o banco:", error);
    }
}


      