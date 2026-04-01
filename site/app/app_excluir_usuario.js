function fnExcluirUsuario(id, elemento) {

    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
        return;
    }

    fetch('http://127.0.0.1:3000/usuarios/' + id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    })
    .then(resposta => resposta.json())
    .then((dados) => {
        elemento.closest("tr").remove()
        alert("Usuário excluido com sucesso!")
    })
    .catch(erro => console.log(erro.message))
}