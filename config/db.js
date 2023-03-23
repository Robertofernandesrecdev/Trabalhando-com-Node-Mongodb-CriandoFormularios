if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI: "NODE_ENV" }
    
} else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}