// configurar as variaveis de ambiente do mongo/bin, criar uma pasta data/db em c:
//em outro cmd tem que deixar o mongod rodando!
//****---------********* */
//instala o mongoose npm install --save mongoose 
// conecxão com o Mongodb  configuração do mongoose   
// const mongoose = require("mongoose")

// mongoose.Promise = global.Promise; 
// mongoose.connect("mongodb://localhost/bancocriado",
//     {
//         //useMongoClient: true  // gerou um erro 
//     }).then(() => {
//     console.log("MongoDB Conectado")

// }).catch((err) => {
//     console.log("Houve um erro ao se conectar com o banco")
// })


// Model - Usuários
// definindo o model
// const UsuarioSchema = mongoose.Schema({
//     nome: {
//         type: String,
//         require: true
//     },
//     sobrenome: {
//         type: String,
//         require: true
//     },
//     email: {
//         type: String,
//         require: true
//     },
//     idade: {
//         type: Number,
//         require: true
//     },
//     pais: {
//         type: String
//     }
// })

// mongoose.model('usuario', UsuarioSchema)

// criando usuario

// const Roberto = mongoose.model('usuario')

// new Roberto ({
//     nome: "Roberto",
//     sobrenome: "Fernandes",
//     email: "robertofernandes199@hotmail.com",
//     idade: 19,
//     pais: "Brasil"
// }).save().then(() => {
//     console.log("Usuário criado com sucesso!")
// }).catch((err) => {
//     console.log("Houve um erro ao registrar o usuário: " + err)
// })

// para verificar o usuário criado
// no cmd  digita mongo
// show databases para listar os bancos criados
// use + banco que foi criado
// show collections verificar o models criados
// db.usuarios.find() vai listar os usuários listados 
// deletar um usuario por id =  db.test_users.deleteOne( {"_id": ObjectId("4d512b45cc9374271b02ec4f")});