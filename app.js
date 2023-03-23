// carregando modulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const adm = require("./routes/adm")
const path = require("path") // esse modulo serve para manipular pastas assim chamamos o bootstrap
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const user = require("./routes/user")
const passport = require("passport")
require("./config/auth")(passport)
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db");


//Configurações
// Sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")  //res.locals cria variaveis globais  
    res.locals.error_msg = req.flash("error_msg")  //res.locals cria variaveis globais 
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
}) // após criar a validação nas rotas!



// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');
// Mongoose **** conectando ao mongodb
const NODE_ENV =process.env.NODE_ENV;
mongoose.Promise = global.Promise;
mongoose.connect(NODE_ENV).then(() => {
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

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).lean().then(( postagem )=> {
        if (postagem) {
          res.render("postagem/index", {postagem: postagem})
        } else {
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")
      }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

app.get("/categoria/", (req, res) => {
    Categoria.find().lean().then((categorias) => {
       res.render("categorias/index", {categorias: categorias})
        
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar categorias")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if (categoria) {

            Postagem.find({ categoria: categoria._id }).lean().then((postagens) => {

                res.render("categorias/postagens", { postagens: postagens, categoria: categoria })
                
            }).catch((err) => {
                req.flash("error_msg", "Não foi possível listar os posts ")
                res.redirect("/")
            })
            
        } else {
            req.flash("error_msg", "Esta categoria não existe!")
            res.redirect("/")
        }

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar esta categoria")
        res.redirect("/")
    })
})


app.use("/adm", adm)
// rota sem prefixo

app.use("/usuarios", user)


// OUtros 

const PORT =  process.env.PORT ||  8089
app.listen(PORT, () => {
    console.log("Servidor rodando.")
})
