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

// DELETAR MOVIMENTAÇÃO
router.delete('/caixa/:id', permitir('admin'), function (req, res) {
const id = req.params.id

conexao.query(`DELETE FROM caixa WHERE id = ?`, [id], function (erro, resultado) {
    if (erro) {
       return res.status(500).send(erro)
    }
    res.send({ "status": 200, "message": "Movimentação excluida com sucesso!"})
})
})


// BUSCAR MOVIMENTAÇÃO POR ID
router.get("/caixa/:id", verificarLogin, permitir("admin", "operador"), (req, res) => {
    const { id } = req.params

    const sql = "SELECT * FROM caixa WHERE id = ?"

    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao buscar movimentação." })
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Movimentação não encontrada." })
        }

        res.json(resultado[0])
    })
})

// EDITAR MOVIMENTAÇÃO
router.put("/caixa/:id", verificarLogin, permitir("admin", "operador"), (req, res) => {
    const { id } = req.params
    const {
        data_movimento,
        associado_id,
        nome_manual,
        categoria_id,
        descricao,
        valor
    } = req.body

    const sql = `
        UPDATE caixa
        SET
            data_movimento = ?,
            associado_id = ?,
            nome_manual = ?,
            categoria_id = ?,
            descricao = ?,
            valor = ?
        WHERE id = ?
    `

    conexao.query(
        sql,
        [
            data_movimento,
            associado_id || null,
            nome_manual || null,
            categoria_id,
            descricao,
            valor,
            id
        ],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({ erro: "Erro ao atualizar movimentação." })
            }

            res.json({ mensagem: "Movimentação atualizada com sucesso." })
        }
    )
})

// FILTRO POR DATA
router.get("/caixa", verificarLogin, function (req, res) {
    const { data_inicio, data_fim } = req.query

    let sql = `
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
        LEFT JOIN categorias cat ON c.categoria_id = cat.id
        LEFT JOIN associados a ON c.associado_id = a.id
        WHERE 1=1
    `

    const params = []

    if (data_inicio) {
        sql += " AND DATE(c.data_movimento) >= ?"
        params.push(data_inicio)
    }

    if (data_fim) {
        sql += " AND DATE(c.data_movimento) <= ?"
        params.push(data_fim)
    }

    sql += " ORDER BY c.data_movimento DESC, c.id DESC"

    conexao.query(sql, params, function (erro, resultados) {
        if (erro) {
            console.log("Erro ao buscar caixa:", erro)
            return res.status(500).json({ erro: "Erro ao buscar caixa." })
        }

        res.json(resultados)
    })
})

module.exports = router