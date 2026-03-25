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

// MENSALIDADES
router.post("/cad-mensalidade", permitir('admin', 'operador'), function (req, res) {
    const {
        associado_id,
    mes,
        ano,
        valor,
        data_pagamento,
        status
    } = req.body

    if (!associado_id || !mes || !ano || !valor || !data_pagamento) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." })
    }

    const sqlBuscaCategoria = `
        SELECT id
        FROM categorias
        WHERE nome = 'Mensalidade' AND tipo = 'entrada'
        LIMIT 1
    `

    conexao.query(sqlBuscaCategoria, function (erroCategoria, resultadoCategoria) {
        if (erroCategoria) {
            console.log("Erro ao buscar categoria Mensalidade:", erroCategoria)
            return res.status(500).json({ erro: "Erro ao buscar categoria Mensalidade." })
        }

        if (resultadoCategoria.length === 0) {
            return res.status(400).json({ erro: "Categoria Mensalidade não encontrada." })
        }

        const categoriaMensalidadeId = resultadoCategoria[0].id

        const sqlVerificaMensalidade = `
            SELECT id, status
            FROM mensalidades
            WHERE associado_id = ? AND mes = ? AND ano = ?
            LIMIT 1
        `

        conexao.query(
            sqlVerificaMensalidade,
            [associado_id, mes, ano],
            function (erroVerifica, resultadoVerifica) {
                if (erroVerifica) {
                    console.log("Erro ao verificar mensalidade:", erroVerifica)
                    return res.status(500).json({ erro: "Erro ao verificar mensalidade." })
                }

                if (resultadoVerifica.length > 0) {
                    const mensalidadeExistente = resultadoVerifica[0]

                    if (mensalidadeExistente.status === "pago") {
                        return res.status(400).json({ erro: "Essa mensalidade já está paga." })
                    }

                    const sqlAtualizaMensalidade = `
                        UPDATE mensalidades
                        SET valor = ?, data_pagamento = ?, status = 'pago'
                        WHERE id = ?
                    `

                    conexao.query(
                        sqlAtualizaMensalidade,
                        [valor, data_pagamento, mensalidadeExistente.id],
                        function (erroAtualiza) {
                            if (erroAtualiza) {
                                console.log("Erro ao atualizar mensalidade:", erroAtualiza)
                                return res.status(500).json({ erro: "Erro ao atualizar mensalidade." })
                            }

                            inserirNoCaixa(mensalidadeExistente.id, categoriaMensalidadeId)
                        }
                    )
                } else {
                    const sqlInsereMensalidade = `
                        INSERT INTO mensalidades
                        (associado_id, mes, ano, valor, data_pagamento, status)
                        VALUES (?, ?, ?, ?, ?, 'pago')
                    `

                    conexao.query(
                        sqlInsereMensalidade,
                        [associado_id, mes, ano, valor, data_pagamento],
                        function (erroInsere, resultadoInsere) {
                            if (erroInsere) {
                                console.log("Erro ao inserir mensalidade:", erroInsere)
                                return res.status(500).json({ erro: "Erro ao cadastrar mensalidade." })
                            }

                            inserirNoCaixa(resultadoInsere.insertId, categoriaMensalidadeId)
                        }
                    )
                }
            }
        )
    })

    function inserirNoCaixa(mensalidadeId, categoriaMensalidadeId) {
        const descricao = `Mensalidade ${String(mes).padStart(2, "0")}/${ano}`

        const sqlVerificaCaixa = `
            SELECT id
            FROM caixa
            WHERE mensalidade_id = ?
            LIMIT 1
        `

        conexao.query(sqlVerificaCaixa, [mensalidadeId], function (erroBuscaCaixa, resultadoBuscaCaixa) {
            if (erroBuscaCaixa) {
                console.log("Erro ao verificar lançamento no caixa:", erroBuscaCaixa)
                return res.status(500).json({ erro: "Erro ao verificar lançamento no caixa." })
            }

            if (resultadoBuscaCaixa.length > 0) {
                return res.json({
                    mensagem: "Mensalidade registrada com sucesso.",
                    mensalidade_id: mensalidadeId,
                    caixa_id: resultadoBuscaCaixa[0].id
                })
            }

            const dadosCaixa = {
                data_movimento: data_pagamento,
                descricao: descricao,
                categoria_id: categoriaMensalidadeId,
                valor: valor,
                associado_id: associado_id,
                nome_manual: null,
                mensalidade_id: mensalidadeId
            }

            conexao.query("INSERT INTO caixa SET ?", dadosCaixa, function (erroCaixa, resultadoCaixa) {
                if (erroCaixa) {
                    console.log("Erro ao lançar no caixa:", erroCaixa)
                    return res.status(500).json({ erro: "Erro ao lançar mensalidade no caixa." })
                }

                return res.json({
                    mensagem: "Mensalidade cadastrada e lançada no caixa com sucesso.",
                    mensalidade_id: mensalidadeId,
                    caixa_id: resultadoCaixa.insertId
                })
            })
        })
    }
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