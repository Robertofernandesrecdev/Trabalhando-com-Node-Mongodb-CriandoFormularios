const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

//.sort({date: 'desc'}) vai ordernar pela data 
router.get("/categorias", (req, res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar categorias")
        res.redirect("/")
    })
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/admin/categorias/nova", (req, res) => {

    //validação
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome muito pequeno" })
    }
    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros }) // chamar a estrutura {{#each erros}} em addcategorias
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            //console.log("Categoria salva com sucesso")
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect("/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria")
           // console.log("Erro ao salvar cartegoria")
            res.redirect("/")
        })
    }
})

router.get("/categorias/edit/:id", (req, res) => {
    // res.send("Página de edição de categoria")
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria:categoria })
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("admin/categorias")
       // res.render("admin/editcategorias")
    })
})

router.post("/categorias/edit", (req, res) => {


    //validação
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome muito pequeno" })
    }
    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros }) // chamar a estrutura {{#each erros}} em addcategorias
    } else {
        const editCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        Categoria.findOne({ _id: req.body.id }).then((categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso")
                res.redirect("/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao salvar a edição")
                res.redirect("/categorias")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar a categoria")
            res.redirect("/categorias")
        })
    }
})

router.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria Deletada com sucesso")
        res.redirect("/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao Deletar")
        res.redirect("/categorias")
    })
})
    
router.get("/postagens", (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/")
    })
})

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        
        res.render("admin/addpostagens", {categorias:categorias })
    }).catch((err) => {
        res.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/")
    })
})

router.post("/postagens/nova", (req, res) => {
    var erros = []

    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: "Titulo inválido" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    }
    if (req.body.titulo.length < 3) {
        erros.push({ texto: "titulo muito pequeno" })
    }
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: "Descrição inválida" })
    }
    if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
        erros.push({ texto: "Conteúdo inválido" })
    }
    if (req.body.conteudo.length < 15) {
        erros.push({ texto: "Conteúdo muito pequeno" })
    }
    if (req.body.descricao.length < 10) {
        erros.push({ texto: "Descrição muito pequena" })
    }

    if (req.body.categoria == "0") {
        erros.push({texto: "Não a categorias cadastradas!"})
    }
    if (erros.length > 0) {
        res.render("admin/addpostagens", {erros: erros})
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem")
            res.redirect("/postagens")
        })
    }
})



module.exports = router