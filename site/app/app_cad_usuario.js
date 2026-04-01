async function fnCadastrarUsuario() {
    const login = document.getElementById("login").value.trim()
    const senha = document.getElementById("senha").value.trim()
    const nivel = document.getElementById("nivel").value
    const mensagem = document.getElementById("mensagem")

    mensagem.innerHTML = ""
    mensagem.className = "mt-3 text-center"

    if (!login || !senha || !nivel) {
        mensagem.innerHTML = "Preencha todos os campos."
        mensagem.classList.add("text-danger")
        return
    }

    const dados = {
        login,
        senha,
        nivel
    }

    try {
        const resposta = await fetch("http://127.0.0.1:3000/cad-usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(dados)
        })

        const resultado = await resposta.json()

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao cadastrar usuário.")
        }

        mensagem.innerHTML = resultado.mensagem
        mensagem.classList.add("text-success")
        alert("Usuário cadastrado com sucesso!")
        document.getElementById("form-cad-usuario").reset()

    } catch (erro) {
        mensagem.innerHTML = erro.message
        mensagem.classList.add("text-danger")
        console.error("Erro ao cadastrar usuário:", erro)
    }
}

const btnCadastrarUsuario = document.getElementById("btn-cadastrar-usuario")

if (btnCadastrarUsuario) {
    btnCadastrarUsuario.addEventListener("click", fnCadastrarUsuario)
}