import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser'

const host = 'localhost';
const porta = 3000;

let listaProduto = [];

const app = express();

//configurar o express para manipular corretamente os dados 
//quando eles forem submetidos via método POST
app.use(express.urlencoded({ extended: true })); //habilita a biblioteca QueryString

app.use(session({
    secret: 'http://localhost:3000',
    resave: true,
    saveUninitialized: true,
    cookie: { //
        maxAge: 1000 * 60 * 15
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) { // Se estiver autenticado
        next();
    } else { // Se não estiver autenticado
        resposta.redirect('/login.html');
    }
}

function cadastrarProduto(requisicao, resposta) {
    const codbarras = requisicao.body.codbarras;
    const descproduto = requisicao.body.descproduto;
    const precusto = requisicao.body.precusto;
    const prevenda = requisicao.body.prevenda;
    const datavalidade = requisicao.body.datavalidade;
    const qtdestoque = requisicao.body.qtdestoque;
    const nomefabricante = requisicao.body.nomefabricante;

    //verificando se os campos foram preenchidos (não estão vazios)
    if (codbarras && descproduto && precusto && prevenda && datavalidade && qtdestoque && nomefabricante) {
        listaProduto.push({
            codbarras: codbarras,
            descproduto: descproduto,
            precusto: precusto,
            prevenda: prevenda,
            datavalidade: datavalidade,
            qtdestoque: qtdestoque,
            nomefabricante: nomefabricante,
        });
        resposta.redirect('/listarProduto');
    } else {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página de cadastro de Produto</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>

        <body style="background-color: #213332;" class="text-center">
            <div class="row">
                <div class="col-6 offset-3">
                    <div class="container m-5 rounded text-start" style="background-color: #2c4443; color: white; ">
                        <form method="POST" action='/cadastrarProduto' class="row g-3 p-5 needs-validation" novalidate>

                            <!-- / Código de barras / -->
                            <div class="col-md-6">
                                <label for="nome" class="form-label">Código de barras:</label>
                                <input type="text" class="form-control" id="codbarras" name="codbarras" required>`)
        if (codbarras == "") {
            resposta.write(`
               <div class="alert alert-danger m-2" role="alert">
                 Por favor, informe um Código de Barras válido.
                </div>`);
        }
        resposta.write(`
        </div>
                    <!-- \ Código de barras \ -->
                    
                    <!-- / Descrição do produto / -->
                    <div class="col-md-6">
                        <label for="nome" class="form-label">Descrição do produto:</label>
                        <input type="text" class="form-control" id="descproduto" name="descproduto" required>`)
        if (descproduto == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe uma Descrição de produto válida.
             </div>`);
        }
        resposta.write(`
        </div>
        <!-- \ Descrição do produto \ -->

                    <!-- / Preço de custo / -->
                    <div class="col-md-6">
                        <label for="nome" class="form-label">Preço de custo:</label>
                        <input type="text" class="form-control" id="precusto" name="precusto" required> `)
        if (precusto == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe um de Preço de custo válido.
             </div>`);
        }
        resposta.write(`
        </div>
        <!-- \ Preço de custo \ -->
        
        <!-- / Preço de venda / -->
        <div class="col-md-6">
        <label for="nome" class="form-label">Preço de venda:</label>
        <input type="text" class="form-control" id="prevenda" name="prevenda" required>`)
        if (prevenda == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
            Por favor, informe um de Preço de venda válido.
            </div>`);
        }
        resposta.write(`
        </div>
        <!-- \ Preço de venda \ -->
        
        <!-- / Data de validade / -->
        <div class="col-md-6">
        <label for="nome" class="form-label">Data de validade:</label>
        <input type="text" class="form-control" id="datavalidade" name="datavalidade" required>`)
        if (datavalidade == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
            Por favor, informe uma Data de validade válida.
            </div>`);
        }
        resposta.write(`
        </div>
        <!-- \ Data de validade \ -->

        <!-- / Qtd em estoque / -->
        <div class="col-md-6">
            <label for="nome" class="form-label">Qtd em estoque:</label>
            <input type="text" class="form-control" id="qtdestoque" name="qtdestoque" required>
        `)
        if (qtdestoque == "") {
            resposta.write(`
                <div class="alert alert-danger m-2" role="alert">
                Por favor, informe uma Quatidade de estoque válida.
                </div>`);
        }
        resposta.write(`
        </div>
                    <!-- \ Qtd em estoque \ -->

                    <!-- / Nome do fabricante / -->
                    <div class="col-md-6">
                        <label for="nome" class="form-label">Nome do fabricante:</label>
                        <input type="text" class="form-control" id="nomefabricante" name="nomefabricante" required>`)
        if (nomefabricante == "") {
            resposta.write(`
             <div class="alert alert-danger m-2" role="alert">
             Por favor, informe um Fabricante válido.
             </div>`);
        }
        resposta.write(` </div>
        <!-- \ Nome do fabricante \ -->

                <div class="row mb-3 mt-5">
                    <div class="col-6 d-grid gap-2">
                        <a class="btn btn-block btn-secondary" href="/">Voltar</a>
                    </div>
                    <div class="col-6 d-grid gap-2">
                        <button class="btn btn-block btn-primary" type="submit" style="border-color: #213332; background-color: #213332;">Cadastrar</button>
                    </div>
                </div>
            </form>
        </div>
        </div>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>

        </html>`)
        resposta.end();
    }
}

function autenticaUsuario(requisicao, resposta) {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123') {
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),
            {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30
            });

        resposta.redirect('/');
    }
    else {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Falha ao realizar Login</title>
        </head>
        
        <body style="background-color: #213332;" class="text-center">
        <h1>Login</h1>
        <p>Usuário ou senha inválidos!</p>
        <a href="/login.html"> Voltar </a>   
        </body>
        </html>`);

        resposta.end();
        // resposta.write('<input type="button" value="Voltar" onclick="history.go(-1)" />')
    }
}

app.post('/login', autenticaUsuario);
app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    // req.session.usuarioLogado = false;
    resp.redirect('/login.html');
});

// Permitir que os usuarios tenham acesso a pasta publica
// Verificando antes, se o usuario esta autenticado
app.use(express.static(path.join(process.cwd(), 'publico')));

// Permitir que os usuarios tenham acesso a pasta protegida
app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastrarProduto', usuarioEstaAutenticado, cadastrarProduto);

app.get('/listarProduto', usuarioEstaAutenticado, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Resultado do cadastro</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Produto</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Código de barras</th>');
    resp.write('<th>Descrição do produto</th>');
    resp.write('<th>Preço de custo</th>');
    resp.write('<th>Preço de venda</th>');
    resp.write('<th>Data de validade</th>');
    resp.write('<th>Qtd em estoque</th>');
    resp.write('<th>Nome do fabricante</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaProduto.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaProduto[i].codbarras}`);
        resp.write(`<td>${listaProduto[i].descproduto}`);
        resp.write(`<td>${listaProduto[i].precusto}`);
        resp.write(`<td>${listaProduto[i].prevenda}`);
        resp.write(`<td>${listaProduto[i].datavalidade}`);
        resp.write(`<td>${listaProduto[i].qtdestoque}`);
        resp.write(`<td>${listaProduto[i].nomefabricante}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu útimo acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }
    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})