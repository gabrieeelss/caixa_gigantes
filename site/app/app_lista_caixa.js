function fnFormatarData(dataIso) {
    if (!dataIso) return "-"

    const data = new Date(dataIso)
    const dia = String(data.getDate()).padStart(2, "0")
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}

function fnMontarLinhaCaixa(mov) {
    const nomeExibido = mov.associado || mov.nome_manual || "-"
    const descricao = mov.descricao || "-"
    const categoria = mov.categoria || "-"
    const valorFormatado = parseFloat(mov.valor).toFixed(2).replace(".", ",")

    const badgeTipo = mov.tipo === "entrada"
        ? `<span class="badge bg-success">Entrada</span>`
        : `<span class="badge bg-danger">Saída</span>`

    const classeValor = mov.tipo === "entrada" ? "text-success fw-bold" : "text-danger fw-bold"
    const sinal = mov.tipo === "entrada" ? "+" : "-"

    return `
        <tr>
            <td>${badgeTipo}</td>
            <td>${fnFormatarData(mov.data_movimento)}</td>
            <td>${nomeExibido}</td>
            <td>${categoria}</td>
            <td>${descricao}</td>
            <td class="${classeValor}">${sinal} R$ ${valorFormatado}</td>
            <td>
                <a href="editar_mov.html?id=${mov.id}" class="btn btn-outline-primary mb-1">📝 Editar</a>
                <button type="button" class="btn btn-outline-danger" onclick="fnExcluirMovimentacao(${mov.id}, this)" title="Excluir">❌ Excluir</button>
            </td>
        </tr>
    `
}

window.fnCarregarCaixa = async function (dataInicio = "", dataFim = "") {
    const tabela = document.getElementById("tabelaCaixa")

    if (!tabela) {
        console.error('Elemento "tabelaCaixa" não encontrado.')
        return
    }

    try {
        let url = "http://127.0.0.1:3000/caixa"
        const params = new URLSearchParams()

        if (dataInicio) params.append("data_inicio", dataInicio)
        if (dataFim) params.append("data_fim", dataFim)

        if (params.toString()) {
            url += `?${params.toString()}`
        }

        console.log("Buscando URL:", url)

        const resposta = await fetch(url, {
            method: "GET",
            credentials: "include"
        })

        if (!resposta.ok) {
            throw new Error(`Erro ao buscar movimentações. Status: ${resposta.status}`)
        }

        const dados = await resposta.json()

        tabela.innerHTML = ""

        if (!dados || dados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">Nenhuma movimentação cadastrada.</td>
                </tr>
            `
            return
        }

        dados.forEach(mov => {
            tabela.innerHTML += fnMontarLinhaCaixa(mov)
        })

    } catch (erro) {
        console.log("Erro ao carregar caixa:", erro)

        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">Erro ao carregar movimentações.</td>
            </tr>
        `
    }
}

window.fnFiltrarMovimentacoes = function () {
    const dataInicio = document.getElementById("data_inicio")?.value || ""
    const dataFim = document.getElementById("data_fim")?.value || ""

    console.log("Clique no filtro:", { dataInicio, dataFim })

    if (!dataInicio && !dataFim) {
        alert("Selecione pelo menos uma data para filtrar.")
        return
    }

    if (dataInicio && dataFim && dataInicio > dataFim) {
        alert("A data inicial não pode ser maior que a data final.")
        return
    }

    window.fnCarregarCaixa(dataInicio, dataFim)
}

window.fnLimparFiltroMovimentacoes = function () {
    const campoInicio = document.getElementById("data_inicio")
    const campoFim = document.getElementById("data_fim")

    if (campoInicio) campoInicio.value = ""
    if (campoFim) campoFim.value = ""

    window.fnCarregarCaixa()
}

document.addEventListener("DOMContentLoaded", function () {
    window.fnCarregarCaixa()
})
