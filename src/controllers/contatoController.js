exports.paginaInicial = (req, res) => {
    res.send(`
        <form action="/" method='POST'>
        Nome do cliente: <input type="text"><br>
        <button>Submit</button>
        </form>
        `) 
}

