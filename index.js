const cors = require('cors')
const session = require("express-session")
const express = require('express')
const app = express()
/* Indica que todas as requisições podem receber Body em JSON. A partir 
disso, o Express aplica um JSON.parse para o conteúdo recebido */
app.use(express.json())
app.get('/', function (req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')
res.send('CaixaGigantes')
})

app.use(cors({
  origin: 'http://127.0.0.1:5500', // origem do front-end
  credentials: true                // permite cookies/sessão
}))

const mysql = require('mysql')
require('dotenv').config()

const conexao = mysql.createPool({
    host: process.env.SERVIDOR_BD,
    user: process.env.USER_BD,
    password: process.env.SENHA_BD,
    database: process.env.DATABASE,
    connectionLimit: 10
})

module.exports = conexao

app.use(session({
    secret: "caixa_gigantes",
    resave: false,
    saveUninitialized: true
}))

// LOGIN
app.post("/login/", function (req, res) {
    const login = req.body.login
    const senha = req.body.senha

    const sql = "SELECT * FROM usuarios WHERE login = ? AND senha = ?"
    conexao.query(sql,[login,senha], function (erro, resultado) {
        if (erro) {
            res.send(erro)
        } else {
            if (resultado.length > 0) {

                req.session.usuario = {
                    id: resultado[0].id,
                    login: resultado[0].login,
                    nivel: resultado[0].nivel_acesso
                }
                res.sendStatus(200)
            } else {
                res.sendStatus(401)
            }
        }
    })
})

// VERIFICAR LOGIN
function verificarLogin(req,res, next){
    if (req.session.usuario) {
        next()
    } else {
        res.status(401).json({ erro: "Não autorizado"})
    }
}

// PERMISSAO DE ADMIN
function somenteAdmin(req,res,next){
    if(req.session.usuario.nivel === "admin"){
        next()
    }else{
        res.status(403).send("Acesso negado")
    }
}

// CADASTRAR ASSOCIADO
app.post("/cad-associado", function (req, res) {
    const data = req.body

    console.log(data)
    conexao.query('INSERT INTO associados set ?', [data],
        function (erro, resultado) {
            if (erro) {
                res.json(erro);
            }
            res.send(resultado.insertId);
        });
})

// EXIBIR ASSOCIADOS
app.get("/exibir-associados", function (req, res) {
    conexao.query("SELECT * FROM associados", function (erro, dados) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar associados" })
        }
        res.json(dados)
    })
})

// EXIBIR CATEGORIAS
app.get("/exibir-categorias", function (req, res) {
    conexao.query("SELECT * FROM categorias", function (erro, dados) {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar categorias" })
        }
        res.json(dados)
    })
})

// CADASTRAR MOVIMENTAÇÃO
app.post("/cad-movimentacao", function (req, res) {
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

// CADASTRAR MENSALIDADE
// app.post("/cad-mensalidade", function (req, res) {
//     const data = req.body

//     console.log(data)

//     conexao.query('INSERT INTO mensalidades SET ?', data, function (erro, resultado) {
//         if (erro) {
//             console.log("Erro ao inserir:", erro)
//             return res.status(500).json({
//                 erro: "Erro ao cadastrar mensalidade",
//                 detalhes: erro.sqlMessage
//             })
//         }

//         return res.json(resultado.insertId)
//     })
// })

app.post("/cad-mensalidade", function (req, res) {
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
app.get("/saldo", function (req, res) {
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
app.get("/caixa", function (req, res) {
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

console.log(process.env.PORTA)
app.listen(process.env.PORTA)
