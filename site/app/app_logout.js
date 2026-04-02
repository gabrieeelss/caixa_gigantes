function logout() {
    fetch("http://127.0.0.1:3000/logout", {
        method: "POST",
        credentials: "include"
    })
    .then(() => {
        window.location.href = "index.html";
    })
    .catch(() => {
        alert("Erro ao sair");
    });
}