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
    if (!data.nome || !data.cpf || !data.rg || !data.endereco) {
        return res.status(400).json({
            erro: "Campos obrigatórios: nome, cpf, rg e endereço"
        })
    }
    conexao.query('INSERT INTO associados SET ?', [data],
        function (erro, resultado) {
            if (erro) {
                console.log(erro);                
               return res.status(500).json({
                erro: "Erro ao cadastrar associado"
               })
            }
            res.status(201).json({
                mensagem: "Associado cadastrado com sucesso!",
                id: resultado.insertId
            })
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
    const data = req.body;

    if (!data.nome || !data.cpf || !data.rg || !data.endereco) {
        return res.status(400).json({
            erro: "Campos obrigatórios: nome, cpf, rg, endereco"
        });
    }

    conexao.query(
        'UPDATE associados SET ? WHERE id = ?',
        [data, id],
        function (erro, resultado) {
            if (erro) {
                console.log(erro);
                return res.status(500).json({
                    erro: "Erro ao atualizar associado"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    erro: "Associado não encontrado"
                });
            }

            res.json({
                mensagem: "Associado atualizado com sucesso"
            });
        }
    );
});

module.exports = router