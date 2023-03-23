const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
// Model de uauario
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

// configurar o sistema de autenticação

module.exports = function (passport) {
    
    passport.use(new localStrategy({ usernameField: 'email', passwordField: "senha" },
        (email, senha, done) => {
        
        Usuario.findOne({ email: email }).then((usuario) => {
            // se não existir
            if (!usuario){
                return done(null, false, {message: "esta conta não existe"})    
            }

            // se existir

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                
                if (batem) {
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: "Senha incorreta"})
                }
            })


        })
    }))
        
    
    //salva os dados do usuário em uma sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findOne({ where: { _id: id } }).then((usuario) => {
            done(null, usuario)
        }).catch((err) => {
            done(err, null)
        })
    })

  
}   





