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
            <td>${mov.categoria}</td>
            <td>${descricao}</td>
            <td class="${classeValor}">${sinal} R$ ${valorFormatado}</td>
        </tr>
    `
}

window.fnCarregarCaixa = async function () {
    try {
        const resposta = await fetch("http://127.0.0.1:3000/caixa")
        const dados = await resposta.json()

        const tabela = document.getElementById("tabelaCaixa")
        tabela.innerHTML = ""

        if (dados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">Nenhuma movimentação cadastrada.</td>
                </tr>
            `
            return
        }

        dados.forEach(mov => {
            tabela.innerHTML += fnMontarLinhaCaixa(mov)
        })

    } catch (erro) {
        console.log("Erro ao carregar caixa:", erro)
    }
}

fnCarregarCaixa()