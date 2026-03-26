const API_URL = "http://127.0.0.1:3000";

const form = document.getElementById("form-cad-associado");
const mensagem = document.getElementById("mensagem");

const inputDataAssociacao = document.getElementById("data_associacao");
const inputDataNascimento = document.getElementById("data_nascimento");
const inputNome = document.getElementById("nome_associado");
const inputEmail = document.getElementById("email_associado");
const inputTelefone = document.getElementById("telefone_associado");
const inputStatus = document.getElementById("status_associado");
const inputCpf = document.getElementById("cpf_associado");
const inputRg = document.getElementById("rg_associado");
const inputEndereco = document.getElementById("endereco_associado");

function mostrarMensagem(texto, tipo = "success") {
    mensagem.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosAssociado = {
        data_associacao: inputDataAssociacao.value || null,
        data_nascimento: inputDataNascimento.value || null,
        nome: inputNome.value.trim(),
        email: inputEmail.value.trim() || null,
        telefone: inputTelefone.value.trim() || null,
        status: inputStatus.value,
        cpf: inputCpf.value.trim(),
        rg: inputRg.value.trim(),
        endereco: inputEndereco.value.trim()
    };

    if (!dadosAssociado.nome || !dadosAssociado.cpf || !dadosAssociado.rg || !dadosAssociado.endereco) {
        mostrarMensagem("Preencha os campos obrigatórios: nome, CPF, RG e endereço.", "danger");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/cad-associado`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(dadosAssociado)
        });

        const retorno = await resposta.json();

        if (!resposta.ok) {
            throw new Error(retorno.erro || "Erro ao cadastrar associado.");
        }

        mostrarMensagem("Associado cadastrado com sucesso.", "success");
        form.reset();

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message || "Não foi possível cadastrar o associado.", "danger");
    }
});