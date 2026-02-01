const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
const { abrirBanco } = require('./database');


const PORTA = 3000;

// Configurações

const pastaPublic = path.join(__dirname, 'public');
console.log("Tentando servir arquivos de:", pastaPublic);

app.use(express.static(pastaPublic));

app.get('/', (req, res) => {
    res.sendFile(path.join(pastaPublic, 'index.html'));
});// 2. Rota de Produtos: Para carregar a tabela lateral
app.get('/api/produtos', async (req, res) => {
    try {
        const db = await abrirBanco();
        const produtos = await db.all('SELECT * FROM produtos');
        res.json(produtos);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

// 3. Rota de Vendas: Para salvar o que você vendeu
app.post('/api/vendas', async (req, res) => {
    try {
        const { itens, total, metodo_pagamento } = req.body;
        const db = await abrirBanco();
        const data = new Date().toLocaleString("pt-BR");

        const resultado = await db.run(
            'INSERT INTO vendas (data, total, metodo_pagamento) VALUES (?, ?, ?)',
            [data, total, metodo_pagamento]
        );
        
        res.json({ mensagem: "Venda salva!", id: resultado.lastID });
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao salvar venda" });
    }
});

// Ligar o servidor
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
});