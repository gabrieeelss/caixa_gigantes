function fnFormatarData(dataIso) {
    if (!dataIso) return "-"

    const data = new Date(dataIso)
    const dia = String(data.getDate()).padStart(2, "0")
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}

function fnMontarLinhaMensalidade(mens) {
    const nomeExibido = mens.associado || "-"
    const valorFormatado = parseFloat(mens.valor || 0).toFixed(2).replace(".", ",")

    let classeStatus = ""
    let textoStatus = mens.status || "-"

    if (mens.status === "pago") {
        classeStatus = "badge bg-success fw-bold text-light"
    } else if (mens.status === "pendente") {
        classeStatus = "badge bg-danger fw-bold text-light"
    }

    return `
        <tr>
            <td>${mens.id}</td>
            <td>${nomeExibido}</td>
            <td>${String(mens.mes).padStart(2, "0")}/${mens.ano}</td>
            <td>R$ ${valorFormatado}</td>
            <td>${fnFormatarData(mens.data_pagamento)}</td>
            <td class="${classeStatus}">${textoStatus}</td>
        </tr>
    `
}

window.fnCarregarMensalidade = async function () {
    try {
        const resposta = await fetch("http://127.0.0.1:3000/mensalidades", {
            method: "GET",
            credentials: "include"
        })

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`)
        }

        const dados = await resposta.json()

        const tabela = document.getElementById("tbody_mensalidades")

        if (!tabela) {
            console.log("tbody_mensalidades não encontrado na página.")
            return
        }

        tabela.innerHTML = ""

        if (!dados || dados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        Nenhuma mensalidade cadastrada.
                    </td>
                </tr>
            `
            return
        }

        dados.forEach(mens => {
            tabela.innerHTML += fnMontarLinhaMensalidade(mens)
        })

    } catch (erro) {
        console.log("Erro ao carregar mensalidades:", erro)

        const tabela = document.getElementById("tbody_mensalidades")
        if (tabela) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Erro ao carregar mensalidades.
                    </td>
                </tr>
            `
        }
    }
}

fnCarregarMensalidade()
