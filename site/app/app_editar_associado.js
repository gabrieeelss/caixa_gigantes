const API_URL = "http://127.0.0.1:3000";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const inputId = document.getElementById("id_associado");
const inputDataAssociacao = document.getElementById("data_associacao");
const inputDataNascimento = document.getElementById("data_nascimento");
const inputNome = document.getElementById("nome_associado");
const inputEmail = document.getElementById("email_associado");
const inputTelefone = document.getElementById("telefone_associado");
const inputStatus = document.getElementById("status_associado");
const inputCpf = document.getElementById("cpf_associado");
const inputRg = document.getElementById("rg_associado");
const inputEndereco = document.getElementById("endereco_associado");
const form = document.getElementById("form-editar-associado");
const mensagem = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo = "success") {
    mensagem.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
}

function formatarDataParaInput(data) {
    if (!data) return "";
    return data.split("T")[0];
}

async function carregarAssociado() {
    if (!id) {
        mostrarMensagem("ID do associado não informado na URL.", "danger");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/associado/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os dados do associado.");
        }

        const associado = await resposta.json();

        inputId.value = associado.id || "";
        inputDataAssociacao.value = formatarDataParaInput(associado.data_associacao);
        inputDataNascimento.value = formatarDataParaInput(associado.data_nascimento);
        inputNome.value = associado.nome || "";
        inputEmail.value = associado.email || "";
        inputTelefone.value = associado.telefone || "";
        inputStatus.value = associado.status || "ativo";
        inputCpf.value = associado.cpf || "";
        inputRg.value = associado.rg || "";
        inputEndereco.value = associado.endereco || "";

    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Não foi possível carregar o associado.", "danger");
    }
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosAtualizados = {
        data_associacao: inputDataAssociacao.value,
        data_nascimento: inputDataNascimento.value,
        nome: inputNome.value,
        email: inputEmail.value,
        telefone: inputTelefone.value,
        status: inputStatus.value,
        cpf: inputCpf.value,
        rg: inputRg.value,
        endereco: inputEndereco.value
    };

    try {
        const resposta = await fetch(`${API_URL}/associado/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(dadosAtualizados)
        });

        const retorno = await resposta.json();

        if (!resposta.ok) {
            throw new Error(retorno.erro || "Erro ao atualizar associado.");
        }

        mostrarMensagem("Associado atualizado com sucesso.", "success");

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message || "Erro ao salvar alterações.", "danger");
    }
});

carregarAssociado();