const express = require('express')
const router = express.Router()
const conexao = require('../db')

const { verificarLogin, permitir } = require('../middlewares/auth')

// EXIBIR ASSOCIADOS
router.get("/exibir-associados", verificarLogin, function (req, res) {
    conexao.query("SELECT * FROM associados", function (erro, dados) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar associados" })
        }
        res.json(dados)
    })
})

// CADASTRAR ASSOCIADO
router.post("/cad-associado", permitir('admin', 'operador'), function (req, res) {
    const data = req.body

    console.log(data)
    conexao.query('INSERT INTO associados SET ?', [data],
        function (erro, resultado) {
            if (erro) {
               return res.status(500).json(erro);
            }
            res.send(resultado.insertId.toString());
        });
})

// DELETAR ASSOCIADO
router.delete('/associados/:id', permitir('admin'), function (req, res) {
const id = req.params.id

conexao.query(`DELETE FROM associados WHERE id = ?`, [id], function (erro, resultado) {
    if (erro) {
       return res.status(500).send(erro)
    }
    res.send({ "status": 200, "message": "Associado excluido com sucesso!"})
})
})

// BUSCAR ASSOCIADO POR ID
router.get("/associado/:id", verificarLogin, function (req, res) {
    const { id } = req.params;
    const sql = "SELECT * FROM associados WHERE id = ?";

    conexao.query(sql, [id], function (erro, resultados) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar associado." });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ erro: "Associado não encontrado." });
        }
        res.json(resultados[0]);
    });
});

// EDITAR ASSOCIADO
router.put("/associado/:id", permitir('admin', 'operador'), function (req, res) {
    const { id } = req.params;
    const {
        data_associacao,
        data_nascimento,
        nome,
        email,
        telefone,
        status,
        cpf,
        rg,
        endereco
    } = req.body;

    const sql = `
        UPDATE associados
        SET
            data_associacao = ?,
            data_nascimento = ?,
            nome = ?,
            email = ?,
            telefone = ?,
            status = ?,
            cpf = ?,
            rg = ?,
            endereco = ?
        WHERE id = ?
    `;

    const valores = [
        data_associacao,
        data_nascimento,
        nome,
        email,
        telefone,
        status,
        cpf,
        rg,
        endereco,
        id
    ];

    conexao.query(sql, valores, function (erro, resultado) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar associado." });
        }

        res.json({ mensagem: "Associado atualizado com sucesso." });
    });
});
module.exports = router