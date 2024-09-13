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
    createDatabaseAndTables();
});

const createDatabaseAndTables = () => {
    const createDatabaseSql = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    db.query(createDatabaseSql, (err) => {
        if (err) {
            console.error('Erro ao criar o banco de dados:', err);
            return;
        }
        console.log('Banco de dados criado ou já existe');

        const useDatabaseSql = `USE ${process.env.DB_NAME}`;
        db.query(useDatabaseSql, (err) => {
            if (err) {
                console.error('Erro ao selecionar o banco de dados:', err);
                return;
            }
            console.log('Banco de dados selecionado');

            const createTables = [
                `CREATE TABLE IF NOT EXISTS cidade (
                    id INT PRIMARY KEY,
                    nome VARCHAR(255) NOT NULL,
                    uf VARCHAR(2) NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS bairro (
                    id INT PRIMARY KEY,
                    nome VARCHAR(255) NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS pessoa (
                    id INT PRIMARY KEY,
                    nome VARCHAR(255) NOT NULL,
                    cidade_id INT,
                    bairro_id INT,
                    cep VARCHAR(10),
                    endereco VARCHAR(255),
                    numero VARCHAR(10),
                    complemento VARCHAR(255),
                    telefone VARCHAR(20),
                    email VARCHAR(255),
                    FOREIGN KEY (cidade_id) REFERENCES cidade(id),
                    FOREIGN KEY (bairro_id) REFERENCES bairro(id)
                )`,
                `CREATE TABLE IF NOT EXISTS produto (
                    id INT PRIMARY KEY,
                    nome VARCHAR(255) NOT NULL,
                    preco DECIMAL(10, 2) NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS vendas (
                    id INT PRIMARY KEY,
                    pessoa_id INT,
                    dt_venda DATE,
                    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
                )`,
                `CREATE TABLE IF NOT EXISTS venda_itens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    venda_id INT,
                    produto_id INT,
                    qtde INT,
                    vr_venda DECIMAL(10, 2),
                    FOREIGN KEY (venda_id) REFERENCES vendas(id),
                    FOREIGN KEY (produto_id) REFERENCES produto(id)
                )`
            ];

            createTables.forEach((sql, index) => {
                db.query(sql, (err) => {
                    if (err) {
                        console.error(`Erro ao criar tabela ${index + 1}:`, err);
                    } else {
                        console.log(`Tabela ${index + 1} criada ou já existe`);
                    }
                });
            });
        });
    });
};

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

    if (!id || !nome) {
        console.log('Erro: Dados insuficientes para inserção');
        return res.status(400).send('Dados insuficientes para inserção');
    }

    const sql = 'INSERT INTO pessoa (id, nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [id, nome, cidade_id, bairro_id, cep, endereco, numero, complemento, telefone, email], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar pessoa:', err);
            return res.status(500).send(`Erro ao adicionar pessoa: ${err.message}`);
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

    if (!nome) {
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

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
