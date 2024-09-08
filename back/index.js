require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rotas
app.get('/', (req, res) => {
    res.send('API em execução');
});

// Rota para listar cidades
app.get('/api/cidades', (req, res) => {
    db.query('SELECT * FROM cidade', (err, results) => {
        if (err) {
            console.error('Erro ao listar cidades:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post('/api/cidades', (req, res) => {
    const { id, nome, uf } = req.body;
    console.log('Dados recebidos para inserção:', { id, nome, uf });

    if (!id || !nome || !uf) {
        console.log('Erro: Dados insuficientes para inserção');
        return res.status(400).send('Dados insuficientes para inserção');
    }

    const sql = 'INSERT INTO cidade (id, nome, uf) VALUES (?, ?, ?)';
    db.query(sql, [id, nome, uf], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar cidade:', err);
            return res.status(500).send(`Erro ao adicionar cidade: ${err.message}`);
        }
        res.json({ id, nome, uf });
    });
});

app.delete('/api/cidades/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM cidade WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar cidade:', err);
            return res.status(500).send(`Erro ao deletar cidade: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Cidade não encontrada');
        }

        res.status(200).send('Cidade deletada com sucesso');
    });
});

app.put('/api/cidades/:id', (req, res) => {
    const { id } = req.params;
    const { nome, uf } = req.body;

    if (!nome || !uf) {
        return res.status(400).send('Dados insuficientes para atualização');
    }

    const sql = 'UPDATE cidade SET nome = ?, uf = ? WHERE id = ?';
    db.query(sql, [nome, uf, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar cidade:', err);
            return res.status(500).send(`Erro ao atualizar cidade: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Cidade não encontrada');
        }

        res.status(200).send('Cidade atualizada com sucesso');
    });
});

// Rota para listar bairros
app.get('/api/bairros', (req, res) => {
    db.query('SELECT * FROM bairro', (err, results) => {
        if (err) {
            console.error('Erro ao listar bairros:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post('/api/bairros', (req, res) => {
    const { id, nome } = req.body;
    console.log('Dados recebidos para inserção de bairro:', { id, nome });

    if (!id || !nome) {
        console.log('Erro: Dados insuficientes para inserção');
        return res.status(400).send('Dados insuficientes para inserção');
    }

    const sql = 'INSERT INTO bairro (id, nome) VALUES (?, ?)';
    db.query(sql, [id, nome], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar bairro:', err);
            return res.status(500).send(err);
        }
        res.json({ id, nome });
    });
});

app.delete('/api/bairros/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM bairro WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar bairro:', err);
            return res.status(500).send(`Erro ao deletar bairro: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Bairro não encontrado');
        }

        res.status(200).send('Bairro deletado com sucesso');
    });
});

app.put('/api/bairros/:id', (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).send('Dados insuficientes para atualização');
    }

    const sql = 'UPDATE bairro SET nome = ? WHERE id = ?';
    db.query(sql, [nome, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar bairro:', err);
            return res.status(500).send(`Erro ao atualizar bairro: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Bairro não encontrado');
        }

        res.status(200).send('Bairro atualizado com sucesso');
    });
});

// Rota para listar pessoas
app.get('/api/pessoas', (req, res) => {
    db.query('SELECT * FROM pessoa', (err, results) => {
        if (err) {
            console.error('Erro ao listar pessoas:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/api/pessoas/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM pessoa WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pessoa:', err);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(404).send('Pessoa não encontrada');
        }

        res.json(results[0]);
    });
});

app.post('/api/pessoas', (req, res) => {
    const { id, nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email } = req.body;
    console.log('Dados recebidos para inserção de pessoa:', { id, nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email });

    if (!id || !nome || !cidade_id || !bairro_id || !cep || !endereco || !numero || !telefone || !email) {
        console.log('Erro: Dados insuficientes para inserção');
        return res.status(400).send('Dados insuficientes para inserção');
    }

    const sql = 'INSERT INTO pessoa (id, nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [id, nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar pessoa:', err);
            return res.status(500).send(err);
        }
        res.json({ id, nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email });
    });
});

app.delete('/api/pessoas/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM pessoa WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar pessoa:', err);
            return res.status(500).send(`Erro ao deletar pessoa: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Pessoa não encontrada');
        }

        res.status(200).send('Pessoa deletada com sucesso');
    });
});

app.put('/api/pessoas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email } = req.body;

    if (!nome || !cidade_id || !bairro_id || !cep || !endereco || !numero || !telefone || !email) {
        return res.status(400).send('Dados insuficientes para atualização');
    }

    const sql = 'UPDATE pessoa SET nome = ?, cidade_id = ?, bairro_id = ?, cep = ?, endereco = ?, numero = ?, complemento = ?, telefone = ?, email = ? WHERE id = ?';
    db.query(sql, [nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar pessoa:', err);
            return res.status(500).send(`Erro ao atualizar pessoa: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Pessoa não encontrada');
        }

        res.status(200).send('Pessoa atualizada com sucesso');
    });
});

app.get('/api/produtos', (req, res) => {
    db.query('SELECT * FROM produto', (err, results) => {
        if (err) {
            console.error('Erro ao listar produtos:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/api/produtos/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM produto WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        res.json(results[0]);
    });
});

app.post('/api/produtos', (req, res) => {
    const { id, nome, preco } = req.body;
    console.log('Dados recebidos para inserção de produto:', { id, nome, preco });

    if (!id || !nome || !preco) {
        console.log('Erro: Dados insuficientes para inserção');
        return res.status(400).send('Dados insuficientes para inserção');
    }

    const sql = 'INSERT INTO produto (id, nome, preco) VALUES (?, ?, ?)';
    db.query(sql, [id, nome, preco], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar produto:', err);
            return res.status(500).send(err);
        }
        res.json({ id, nome, preco });
    });
});

app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM produto WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar produto:', err);
            return res.status(500).send(`Erro ao deletar produto: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        res.status(200).send('Produto deletado com sucesso');
    });
});

app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;

    if (!nome || !preco) {
        return res.status(400).send('Dados insuficientes para atualização');
    }

    const sql = 'UPDATE produto SET nome = ?, preco = ? WHERE id = ?';
    db.query(sql, [nome, preco, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            return res.status(500).send(`Erro ao atualizar produto: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        res.status(200).send('Produto atualizado com sucesso');
    });
});

app.get('/api/vendas', (req, res) => {
    db.query('SELECT * FROM vendas', (err, results) => {
        if (err) {
            console.error('Erro ao listar vendas:', err);
            return res.status(500).json({ error: 'Erro ao listar vendas' });
        }
        res.json(results); // Verifique se 'results' é o formato JSON esperado
    });
});


app.get('/api/vendas/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM vendas WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar venda:', err);
            return res.status(500).json({ error: 'Erro ao buscar venda', details: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        console.log('Venda encontrada:', results[0]); // Log para depuração

        res.json(results[0]);
    });
});


app.post('/api/vendas', (req, res) => {
    const { id, pessoa_id, dt_venda } = req.body;
    console.log('Dados recebidos para inserção de venda:', { id, pessoa_id, dt_venda });

    if (!id || !pessoa_id || !dt_venda) {
        console.log('Erro: Dados insuficientes para inserção');
        return res.status(400).send('Dados insuficientes para inserção');
    }

    const sql = 'INSERT INTO vendas (id, pessoa_id, dt_venda) VALUES (?, ?, ?)';
    db.query(sql, [id, pessoa_id, dt_venda], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar venda:', err);
            return res.status(500).send(err);
        }
        res.json({ id, pessoa_id, dt_venda });
    });
});

app.delete('/api/vendas/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM vendas WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar venda:', err);
            return res.status(500).send(`Erro ao deletar venda: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Venda não encontrada');
        }

        res.status(200).send('Venda deletada com sucesso');
    });
});

app.put('/api/vendas/:id', (req, res) => {
    const { id } = req.params;
    const { pessoa_id, data } = req.body;

    if (!id || !pessoa_id || !dt_venda) {
        return res.status(400).send('Dados insuficientes para atualização');
    }

    const sql = 'UPDATE vendas SET pessoa_id = ?, dt_venda = ? WHERE id = ?';
    db.query(sql, [pessoa_id, dt_venda, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar venda:', err);
            return res.status(500).send(`Erro ao atualizar venda: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Venda não encontrada');
        }

        res.status(200).send('Venda atualizada com sucesso');
    });
});

app.get('/api/venda_itens', (req, res) => {
    db.query('SELECT * FROM venda_itens', (err, results) => {
        if (err) {
            console.error('Erro ao listar itens de venda:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    }
    );
});

app.get('/api/venda_itens/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM venda_itens WHERE venda_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar itens de venda:', err);
            return res.status(500).json({ error: 'Erro ao buscar itens de venda', details: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Itens de venda não encontrados' });
        }

        res.json(results);
    });
});


app.post('/api/venda_itens', (req, res) => {
    const {venda_id, produto_id, qtde, vr_venda } = req.body;
    console.log('Dados recebidos para inserção de item de venda:', {venda_id, produto_id, qtde, vr_venda });

    if (!venda_id || !produto_id || !qtde || !vr_venda) {
        console.log('Erro: Dados insuficientes para inserção');
        return res.status(400).send('Dados insuficientes para inserção');
    }

    const sql = 'INSERT INTO venda_itens (venda_id, produto_id, qtde, vr_venda) VALUES (?, ?, ?, ?)';
    db.query(sql, [ venda_id, produto_id, qtde, vr_venda], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar item de venda:', err);
            return res.status(500).send(err);
        }
        res.json({ venda_id, produto_id, qtde, vr_venda });
    });
});


app.delete('/api/venda_itens/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM venda_itens WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar item de venda:', err);
            return res.status(500).send(`Erro ao deletar item de venda: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Item de venda não encontrado');
        }

        res.status(200).send('Item de venda deletado com sucesso');
    });
});

app.put('/api/venda_itens/:id', (req, res) => {
    const { id } = req.params;
    const { venda_id, produto_id, quantidade, preco } = req.body;

    if (!venda_id || !produto_id || !quantidade || !preco) {
        return res.status(400).send('Dados insuficientes para atualização');
    }

    const sql = 'UPDATE venda_itens SET venda_id = ?, produto_id = ?, quantidade = ?, preco = ? WHERE id = ?';
    db.query(sql, [venda_id, produto_id, quantidade, preco, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar item de venda:', err);
            return res.status(500).send(`Erro ao atualizar item de venda: ${err.message}`);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Item de venda não encontrado');
        }

        res.status(200).send('Item de venda atualizado com sucesso');
    });
});



// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});