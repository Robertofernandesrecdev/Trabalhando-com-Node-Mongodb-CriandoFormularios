const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")

router.get('/', eAdmin, (req, res) => {
    res.render("adm/index")
})

router.get('/posts', eAdmin, (req, res) => {
    res.send("Página de posts")
})

//.sort({date: 'desc'}) vai ordernar pela data 
router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render("adm/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar categorias")
        res.redirect("/adm")
    })
})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render("adm/addcategorias")
})

router.post("/categorias/nova", eAdmin, (req, res) => {

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
        res.render("adm/addcategorias", { erros: erros }) // chamar a estrutura {{#each erros}} em addcategorias
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            //console.log("Categoria salva com sucesso")
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect("/adm/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria")
           // console.log("Erro ao salvar cartegoria")
            res.redirect("/")
        })
    }
})

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    // res.send("Página de edição de categoria")
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("adm/editcategorias", {categoria:categoria })
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("adm/categorias")
       // res.render("adm/editcategorias")
    })
})

router.post("/categorias/edit", eAdmin, (req, res) => {


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
        res.render("adm/addcategorias", { erros: erros }) // chamar a estrutura {{#each erros}} em addcategorias
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
                res.redirect("/adm/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao salvar a edição")
                res.redirect("/adm/categorias")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar a categoria")
            res.redirect(" /adm/categorias")
        })
    }
})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria Deletada com sucesso")
        res.redirect("/adm/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao Deletar")
        res.redirect("/adm/categorias")
    })
})
    
router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("adm/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        
        res.render("adm/addpostagens", {categorias:categorias })
    }).catch((err) => {
        res.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {
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
        res.render("adm/addpostagens", {erros: erros})
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
            res.redirect("/adm/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem")
            res.redirect("/adm/postagens")
        })
    }
})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {

    Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {
        
        Categoria.find().lean().then((categorias) => {
            res.render("adm/editpostagens", {categorias: categorias, postagem: postagem} )
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar categorias")
            res.redirect("/adm/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o form/edição")
        res.redirect("/adm/postagens")
    })
    
})

router.post("/postagem/edit", eAdmin,  (req, res) => {

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
        erros.push({ texto: "Não a categorias cadastradas!" })
    }
    
    if (erros.length > 0) {
        res.render("adm/addpostagens", { erros: erros })
    } else {
        const editPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        Postagem.findOne({ _id: req.body.id }).then((postagem) => {
        
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso")
                res.redirect("/adm/postagens")
            }).catch((err) => {
                req.flash("error_msg", "Erro interno")
                res.redirect("/adm/postagens")
            })

        }).catch((err) => {
           // console.log(err)
            req.flash("error_msg", "Houve um erro ao salvar a edição")
            res.redirect("/adm/postagens")
        })
    
    }
})


// Outra maneira de deletar mais não recomendada pois é um get
// router.get("/postagens/deletar/:id", (req, res) => {
//     Postagem.deleteOne({ _id: req.params.id }).then(() => {
//         res.redirect("/postagens")
//     })
// })

router.post("/postagens/deletar", eAdmin, (req, res) => {
    Postagem.deleteOne({ _id: req.body.id }).then(() => {
       
        req.flash("success_msg", "Postagem Deletada com sucesso")
        res.redirect("/adm/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao Deletar")
        res.redirect("/adm/postagens")
    })
})



module.exports = router