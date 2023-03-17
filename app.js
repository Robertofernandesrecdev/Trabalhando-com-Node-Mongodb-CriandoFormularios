// carregando modulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path") // esse modulo serve para manipular pastas assim chamamos o bootstrap
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")

//Configurações
// Sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")  //res.locals cria variaveis globais  
    res.locals.error_msg = req.flash("error_msg")  //res.locals cria variaveis globais 
    next()
}) // após criar a validação nas rotas!


// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');
// Mongoose **** conectando ao mongodb
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Conectado ao mongo")
}).catch((err) => {
    console.log("Erro ao se conectar" + err)
})


// Public -> todos os arquivos estaticos está em public 
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
   // console.log("Oi eu sou um Middleware")
    next()
})

// Rotas
// o prefixo que estimer na barra vai ter que ser passado! Ex; /params
//app.use('/params', admin) // http://localhost:8081/params/categorias


app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        
        res.render("index", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
}) 

app.get("/404", (req, res) => {
    res.send("Erro 404")
})

app.use('/', admin)
// rota sem prefixo


// OUtros 
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando.")
})
