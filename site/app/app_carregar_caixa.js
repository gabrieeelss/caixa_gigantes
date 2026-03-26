
async function carregarCaixa() {

    const resposta = await fetch("http://localhost:3000/caixa", {
        method: 'GET',
        credentials: 'include'
    })
    const dados = await resposta.json()

    let tabela = document.getElementById("tabelaCaixa")
    tabela.innerHTML = ""

    let saldo = 0

    dados.forEach(item => {

        let classe = item.tipo === "entrada" ? "text-success" : "text-danger"

        if (item.tipo === "entrada") {
            saldo += parseFloat(item.valor)
        } else {
            saldo -= parseFloat(item.valor)
        }

        tabela.innerHTML += `
        <tr>
        <td>${item.data_movimento}</td>
        <td>${item.categoria_id}</td>
        <td>${item.associado}</td>
        <td>${item.nome_manual}</td>
        <td>${item.descricao}</td>
        <td>${item.tipo}</td>
        <td class="${classe}">
        R$ ${item.valor}
        </td>
        </tr>
        `
    })
    document.getElementById("saldo").innerText = saldo.toFixed(2)
}
