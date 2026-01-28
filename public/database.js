const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function abrirBanco() {
    const db = await open({
        filename: './distribuidora.db',
        driver: sqlite3.Database
    });

    // Criação das tabelas
    await db.exec(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            preco REAL,
            preco custo Real,
            estoque INTEGER
        );

        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT,
            total REAL,
            metodo_pagamento TEXT,
            itens_json TEXT
        );
    `);

    return db;
}

module.exports = { abrirBanco };