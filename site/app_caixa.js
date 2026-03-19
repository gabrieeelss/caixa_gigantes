function fnLimparCampos() {
    document.getElementById("form-fluxo-caixa").reset()
}

async function fnAdicionarMovimento() {

    let dadosMovimentacao = {
        data_movimento: document.getElementById("data_movimento").value,
        categoria_id: document.getElementById("categoria_id").value,
        associado_id: document.getElementById("associado_id_caixa").value || null,
        nome_manual: document.getElementById("nome_manual").value,
        descricao: document.getElementById("descricao").value,
        valor: document.getElementById("valor_mov").value
    }
console.log(dadosMovimentacao);

    await fetch("http://127.0.0.1:3000/cad-movimentacao", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosMovimentacao),
        credentials: 'include'
    })
    .then(resposta => {
        if (!resposta.ok) {
            return resposta.json().then(err => {
                throw new Error(err.erro || "Erro " + resposta.status)
            })
        }
        return resposta.json()
    })
    .then(dados => {
        fnLimparCampos()
        console.log(dados)
        fnCarregarSaldo()
        alert("Movimentação Cadastrada Com Sucesso! ID: " + dados)
    })
    .catch(erro => console.log(erro))
}

async function fnCarregarAssociados() {
    const resposta = await fetch("http://127.0.0.1:3000/exibir-associados")
    const dados = await resposta.json()
    let select = document.getElementById("associado_id_caixa")
    dados.forEach(a => {
        select.innerHTML += `
<option value="${a.id}">
${a.nome}
</option>
`
    })
}

async function fnCarregarCategorias() {
    const resposta = await fetch("http://127.0.0.1:3000/exibir-categorias")
    const dados = await resposta.json()
    let select = document.getElementById("categoria_id")
    dados.forEach(a => {
        select.innerHTML += `
<option value="${a.id}">
${a.nome}
</option>
`
    })
}

let btn_salvar = document.getElementById("btn-add-mov")
btn_salvar.addEventListener("click", fnAdicionarMovimento)
fnCarregarAssociados()
fnCarregarCategorias()