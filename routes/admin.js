const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

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




module.exports = router