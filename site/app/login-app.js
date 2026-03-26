function fnFazerLogin() {
let formDados = {
login: document.getElementById("login").value,
senha: document.getElementById("senha").value
}
fetch('http://127.0.0.1:3000/login/', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(formDados),
credentials: 'include'
})
.then(resposta => resposta.status)
.then((status) => {
    if(status == 200){
        window.location.href = "caixa.html"
    }else{
        alert("Login inválido")
    }

})
.catch(erro => console.log(erro.message))
}

let btn_login = document.getElementById("btn-login")

btn_login.addEventListener("click", function () {
    fnFazerLogin()
})