function fnCarregarUsuarios(usuario) {
    let linha = `
                            <tr>
                                <td>${usuario.id}</td>
                                <td>${usuario.login}</td>
                                <td>${usuario.nivel}</td>
                                <td>
                                <button type="button" class="btn btn-outline-danger" onclick="fnExcluirUsuario(${usuario.id}, event.target)" title="Excluir">❌ Excluir</button>
                            </tr>
    `

    document.querySelector("#tabela_usuarios").innerHTML += linha
}

function fnCarregarDados() {
    fetch('http://127.0.0.1:3000/exibir-usuarios', { 
        method: 'GET', 
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
        .then(usuarios => {
            if (Array.isArray(usuarios)) {
            usuarios.forEach(fnCarregarUsuarios)
            }else{
                console.log("Falha ao carregar usuarios:", usuarios)
            }
        })
        .catch(erro => console.log(erro.message))

}

fnCarregarDados()