const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

// Função para abrir a conexão com o banco de dados
async function abrirBanco() {
    return open({
        filename: path.join(__dirname, 'database.db'),
        driver: sqlite3.Database
    });
}

// Função para criar as tabelas iniciais se elas não existirem
async function inicializarBanco() {
    const db = await abrirBanco();
    
    // Tabela de Produtos
    await db.exec(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            estoque INTEGER DEFAULT 0
        )
    `);

    // Tabela de Vendas
    await db.exec(`
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            total REAL NOT NULL,
            metodo_pagamento TEXT NOT NULL
        )
    `);

    // Verifica se o banco está vazio e adiciona itens de teste se necessário
    const produtos = await db.all('SELECT * FROM produtos LIMIT 1');
    if (produtos.length === 0) {
        console.log("📌 Banco vazio. Adicionando produtos de teste...");
        await db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', ['Cerveja Heineken 330ml', 9.99, 50]);
        await db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', ['Coca-Cola 2L', 12.00, 30]);
        await db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', ['Cerveja Brahma 350ml', 5.50, 100]);
    }
}

// Inicializa o banco ao carregar o módulo
inicializarBanco().catch(err => console.error("Erro ao inicializar banco:", err));

module.exports = { abrirBanco };