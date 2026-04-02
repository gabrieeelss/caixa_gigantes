const API_URL = "http://127.0.0.1:3000"

function fnObterIdDaUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get("id")
}

function fnFormatarDataParaInput(dataIso) {
    if (!dataIso) return ""

    const data = new Date(dataIso)
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const dia = String(data.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
}

async function fnCarregarCategorias() {
    try {
        const resposta = await fetch(`${API_URL}/exibir-categorias`, {
            method: "GET",
            credentials: "include"
        })

        const categorias = await resposta.json()
        const select = document.getElementById("categoria_id")

        select.innerHTML = `<option value="">Selecione uma categoria</option>`

        categorias.forEach(categoria => {
            select.innerHTML += `<option value="${categoria.id}">${categoria.nome}</option>`
        })
    } catch (erro) {
        console.log("Erro ao carregar categorias:", erro)
    }
}

async function fnCarregarAssociados() {
    try {
        const resposta = await fetch(`${API_URL}/exibir-associados`, {
            method: "GET",
            credentials: "include"
        })

        const associados = await resposta.json()
        const select = document.getElementById("associado_id")

        select.innerHTML = `<option value="">Selecione um associado</option>`

        associados.forEach(associado => {
            select.innerHTML += `<option value="${associado.id}">${associado.nome}</option>`
        })
    } catch (erro) {
        console.log("Erro ao carregar associados:", erro)
    }
}

async function fnCarregarMovimentacao() {
    const id = fnObterIdDaUrl()

    if (!id) {
        alert("Movimentação não informada.")
        window.location.href = "caixa.html"
        return
    }

    try {
        const resposta = await fetch(`${API_URL}/caixa/${id}`, {
            method: "GET",
            credentials: "include"
        })

        if (!resposta.ok) {
            throw new Error("Movimentação não encontrada.")
        }

        const mov = await resposta.json()

        document.getElementById("id_movimentacao").value = mov.id
        document.getElementById("data_movimento").value = fnFormatarDataParaInput(mov.data_movimento)
        document.getElementById("associado_id").value = mov.associado_id || ""
        document.getElementById("nome_manual").value = mov.nome_manual || ""
        document.getElementById("categoria_id").value = mov.categoria_id || ""
        document.getElementById("descricao").value = mov.descricao || ""
        document.getElementById("valor").value = mov.valor || ""

    } catch (erro) {
        console.log("Erro ao carregar movimentação:", erro)
        alert("Erro ao carregar movimentação.")
        window.location.href = "caixa.html"
    }
}

async function fnSalvarMovimentacao(event) {
    event.preventDefault()

    const confirmar = confirm("Deseja salvar as alterações?")

    if (!confirmar) {
        return
    }

    const id = document.getElementById("id_movimentacao").value

    const dados = {
        data_movimento: document.getElementById("data_movimento").value,
        associado_id: document.getElementById("associado_id").value || null,
        nome_manual: document.getElementById("nome_manual").value,
        categoria_id: document.getElementById("categoria_id").value,
        descricao: document.getElementById("descricao").value,
        valor: document.getElementById("valor").value
    }

    try {
        const resposta = await fetch(`${API_URL}/caixa/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(dados)
        })

        const resultado = await resposta.json()

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao salvar alterações.")
        }

        alert("Movimentação atualizada com sucesso.")
        window.location.href = "caixa.html"

    } catch (erro) {
        console.log("Erro ao atualizar movimentação:", erro)
        alert(erro.message)
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await fnCarregarCategorias()
    await fnCarregarAssociados()
    await fnCarregarMovimentacao()

    document
        .getElementById("formEditarMovimentacao")
        .addEventListener("submit", fnSalvarMovimentacao)
})