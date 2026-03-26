function verificarLogin(req, res, next) {
    if (req.session && req.session.usuario) {
        next()
    } else {
        res.status(401).send('Não autorizado')
    }
}

function permitir(...niveisPermitidos) {
    return function (req, res, next) {
        console.log("SESSION:", req.session);
        console.log("USUARIO:", req.session.usuario);
        console.log("NIVEL:", req.session.usuario?.nivel);
        console.log("PERMITIDOS:", niveisPermitidos);

        if (!req.session.usuario) {
            return res.status(401).json({
                erro: "Não autorizado"
            })
        }
        if (!niveisPermitidos.includes(req.session.usuario.nivel)) {
            return res.status(403).json({
                erro: "Acesso negado"
            })
        }
        next()
    }
}

module.exports = {
    verificarLogin,
    permitir
}