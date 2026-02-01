const express = require('express');
const cors = require('cors');
const path = require('path');
const { abrirBanco } = require('./database');

const app = express();
const PORTA = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração de Arquivos Estáticos (Frontend)
const pastaPublic = path.join(__dirname, 'public');
app.use(express.static(pastaPublic));

// --- ROTAS DE PRODUTOS ---

// 1. Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const db = await abrirBanco();
        const produtos = await db.all('SELECT * FROM produtos');
        res.json(produtos);
    } catch (erro) {
        console.error("Erro ao buscar produtos:", erro);
        res.status(500).json({ erro: "Erro ao buscar produtos no banco de dados" });
    }
});

// 2. Adicionar novo produto
app.post('/api/produtos', async (req, res) => {
    try {
        const { nome, preco, estoque } = req.body;
        
        if (!nome || preco === undefined) {
            return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
        }

        const db = await abrirBanco();
        const resultado = await db.run(
            'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
            [nome, preco, estoque || 0]
        );

        res.json({ mensagem: "Produto adicionado!", id: resultado.lastID });
    } catch (erro) {
        console.error("Erro ao adicionar produto:", erro);
        res.status(500).json({ erro: "Erro ao adicionar produto" });
    }
});

// 3. Deletar um produto
app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await abrirBanco();
        const resultado = await db.run('DELETE FROM produtos WHERE id = ?', [id]);
        
        if (resultado.changes > 0) {
            res.json({ mensagem: "Produto deletado com sucesso!" });
        } else {
            res.status(404).json({ erro: "Produto não encontrado" });
        }
    } catch (erro) {
        console.error("Erro ao deletar produto:", erro);
        res.status(500).json({ erro: "Erro ao deletar produto" });
    }
});

// --- ROTAS DE VENDAS ---

// 4. Salvar uma nova venda
app.post('/api/vendas', async (req, res) => {
    try {
        const { itens, total, metodo_pagamento } = req.body;
        
        if (!total || !metodo_pagamento) {
            return res.status(400).json({ erro: "Dados da venda incompletos" });
        }

        const db = await abrirBanco();
        const data = new Date().toLocaleString("pt-BR");

        // Salva a venda principal
        const resultadoVenda = await db.run(
            'INSERT INTO vendas (data, total, metodo_pagamento) VALUES (?, ?, ?)',
            [data, total, metodo_pagamento]
        );
        
        const vendaId = resultadoVenda.lastID;

        // Opcional: Se você tiver uma tabela 'itens_venda', você percorreria o array 'itens' aqui
        // para salvar cada produto vinculado ao vendaId.

        res.json({ mensagem: "Venda salva com sucesso!", id: vendaId });
    } catch (erro) {
        console.error("Erro ao salvar venda:", erro);
        res.status(500).json({ erro: "Erro ao registrar a venda" });
    }
});

// Rota padrão para servir o index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(pastaPublic, 'index.html'));
});

// Inicialização do Servidor
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    console.log(`📂 Servindo arquivos estáticos de: ${pastaPublic}`);
});