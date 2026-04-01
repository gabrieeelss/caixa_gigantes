const express = require('express')
const router = express.Router()
const conexao = require('../db')

const { verificarLogin, permitir } = require('../middlewares/auth')


// EXIBIR CATEGORIAS
router.get("/exibir-categorias", verificarLogin, function (req, res) {
    conexao.query("SELECT * FROM categorias", function (erro, dados) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar categorias" })
        }
        res.json(dados)
    })
})

// CADASTRAR MOVIMENTAÇÃO
router.post("/cad-movimentacao", permitir('admin', 'operador'), function (req, res) {
    const data = req.body

    console.log(data)

    conexao.query('INSERT INTO caixa SET ?', data, function (erro, resultado) {
        if (erro) {
            console.log("Erro ao inserir:", erro)
            return res.status(500).json({
                erro: "Erro ao cadastrar movimentação",
                detalhes: erro.sqlMessage
            })
        }

        return res.json(resultado.insertId)
    })
})

// SALDO
router.get("/saldo", verificarLogin, function (req, res) {
    const sql = `
        SELECT 
            COALESCE(SUM(
                CASE
                    WHEN cat.tipo = 'entrada' THEN c.valor
                    WHEN cat.tipo = 'saida' THEN -c.valor
                END
            ), 0) AS saldo
        FROM caixa c
        INNER JOIN categorias cat ON cat.id = c.categoria_id
    `
    conexao.query(sql, function (erro, resultado) {
        if (erro) {
            console.log("Erro ao calcular saldo:", erro)
            return res.status(500).json({ erro: "Erro ao calcular saldo" })
        }

        return res.json(resultado[0])
    })
})

// LISTAR MOVIMENTAÇÕES
router.get("/caixa", verificarLogin, function (req, res) {
    const sql = `
        SELECT
            c.id,
            c.data_movimento,
            c.descricao,
            c.valor,
            c.nome_manual,
            cat.nome AS categoria,
            cat.tipo,
            a.nome AS associado
        FROM caixa c
        INNER JOIN categorias cat ON cat.id = c.categoria_id
        LEFT JOIN associados a ON a.id = c.associado_id
        ORDER BY c.data_movimento DESC, c.id DESC
    `
    conexao.query(sql, function (erro, resultado) {
        if (erro) {
            console.log("Erro ao buscar movimentações:", erro)
            return res.status(500).json({ erro: "Erro ao buscar movimentações" })
        }

        return res.json(resultado)
    })
})



module.exports = router