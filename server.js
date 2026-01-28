const express = require('express');
const cors = require('cors');
const { abrirBanco } = require('./database');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Rota principal para abrir o index.html automaticamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Rota para cadastrar novo produto
app.post('/api/produtos', async (req, res) => {
    const { nome, preco, estoque } = req.body;
    const db = await abrirBanco();
    
    await db.run(
        'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
        [nome, preco, estoque]
    );
    
    res.json({ status: "Produto cadastrado!" });
});

// Rota para buscar todos os produtos (para preencher o PDV)
app.get('/api/produtos', async (req, res) => {
    const db = await abrirBanco();
    const produtos = await db.all('SELECT * FROM produtos');
    res.json(produtos);
});

app.get('/api/relatorios', async (req, res) => {
    const db = await abrirBanco();
    
    // 1. Total vendido HOJE
    const hoje = new Date().toLocaleDateString();
    const totalHoje = await db.get('SELECT SUM(total) as total FROM vendas WHERE data LIKE ?', [`${hoje}%`]);

    // 2. Produto Campeão do DIA
    const campeaoDia = await db.get(`
        SELECT json_extract(value, '$.nome') as nome, SUM(json_extract(value, '$.qtd')) as qtd
        FROM vendas, json_each(vendas.itens_json)
        WHERE data LIKE ?
        GROUP BY nome ORDER BY qtd DESC LIMIT 1
    `, [`${hoje}%`]);

    // 3. Estimativa de Lucro (Simplificada)
    // Aqui subtraímos o custo do preço de venda dos itens vendidos
    // Nota: Requer que os itens_json guardem o preco_custo no momento da venda
    
    res.json({
        faturamentoHoje: totalHoje.total || 0,
        produtoEstrela: campeaoDia ? campeaoDia.nome : "Nenhuma venda",
        qtdEstrela: campeaoDia ? campeaoDia.qtd : 0
    });
});

// Rota para salvar a venda
app.post('/api/vendas', async (req, res) => {
    const { total, pagamento, itens } = req.body;
    const db = await abrirBanco();
    
    // Salva a venda
    await db.run(
        'INSERT INTO vendas (data, total, metodo_pagamento, itens_json) VALUES (?, ?, ?, ?)',
        [new Date().toLocaleString(), total, pagamento, JSON.stringify(itens)]
    );

    // Baixa o estoque de cada item vendido
    for (const item of itens) {
        await db.run('UPDATE produtos SET estoque = estoque - ? WHERE nome = ?', [item.qtd, item.nome]);
    }

    res.json({ status: "Venda salva no SQLite!" });
});

app.get('/api/inventario', async (req, res) => {
    const db = await abrirBanco();
    const produtos = await db.all('SELECT * FROM produtos ORDER BY estoque ASC');
    res.json(produtos);
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));