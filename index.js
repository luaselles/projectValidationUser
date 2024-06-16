import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser'

const host = 'localhost';
const porta = 3000;

let listaInterressados = [];
let listaPets = [];
let listaInterresadosPet = [];

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

function cadastrarInterresados(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const email = requisicao.body.email;
    const telefone = requisicao.body.telefone;

    //verificando se os campos foram preenchidos (não estão vazios)
    if (nome && email && telefone) {
        listaInterressados.push({
            nome: nome,
            email: email,
            telefone: telefone,
        });
        resposta.redirect('/listarInterresado');
    } else {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página de cadastro de Interresado</title>
            <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        
            <link
                href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                rel="stylesheet">
        
            <link rel="stylesheet" href="css/sb-admin-2.min.css">
        
            <link rel="stylesheet" href="css/itens.css">
        </head>
        
        <body>
            <!-- Page Wrapper -->
            <div id="wrapper">
        
                <!-- Sidebar -->
                <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        
                    <!-- Sidebar - Brand -->
                    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                        <div class="sidebar-brand-icon rotate-n-15">
                            <i class="fas fa-laugh-wink"></i>
                        </div>
                        <div class="sidebar-brand-text mx-3">
                            <img src="https://img.freepik.com/vetores-gratis/pata-de-design-de-logotipo-de-animal-de-estimacao-vetor-para-loja-de-animais_53876-136741.jpg"
                                alt="AdminLTE Logo" width="30" height="30" class="brand-image img-circle elevation-3 mr-1"
                                style="opacity: .8">
                            <span>Pet Shop</span>
        
                        </div>
                    </a>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider my-0">
        
                    <!-- Nav Item - Dashboard -->
                    <li class="nav-item active">
                        <a class="nav-link" href="index.html">
                            <i class="fa fa-tachometer"></i>
                            <span>Dashboard</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Cadastro
                    </div>
        
                    <!-- Nav Item - Tables -->
                    <li class="nav-item">
                        <a class="nav-link" href="cadastroInterresados.html">
                            <i class="fa fa-user-o"></i>
                            <span>Interessados</span></a>
                    </li>
        
                    <li class="nav-item">
                        <a class="nav-link" href="cadastroPets.html">
                            <i class="fa fa-paw"></i>
                            <span>Pets</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Listagem
                    </div>
        
                    <!-- Nav Item - Tables -->
                    <li class="nav-item">
                        <a class="nav-link" href="/listarInterresado">
                            <i class="fa fa-user-o"></i>
                            <span>Interessados</span></a>
                    </li>
        
                    <li class="nav-item">
                        <a class="nav-link" href="/listarPet">
                            <i class="fa fa-paw"></i>
                            <span>Pets</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Adote
                    </div>
        
                    <!-- Nav Item - Charts -->
                    <li class="nav-item">
                        <a class="nav-link" href="/adotarPet">
                            <i class="fa fa-paw"></i>
                            <span>Adote um pet</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <li class="nav-item">
                        <a class="nav-link" href="/logout">
                            <i class="fa fa-sign-out"></i>
                            <span>Sair</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider d-none d-md-block">
        
                </ul>
                <!-- End of Sidebar -->
        
                <div class="row">
                    <div class="col-9 offset-1">
                        <div class="container m-5 rounded text-start form-cadastro-interressados">
        
                            <form method="POST" action='/cadastrarInterresado' class="row g-3 p-5 needs-validation" novalidate>
        
                                <h4>Cadastro de Interessados</h4>
                                <hr>
        
                                <!-- / Nome / -->
                                <div class="col-md-12">
                                    <label for="nome" class="form-label">Nome:</label>
                                    <input type="text" class="form-control" id="nome" name="nome" required> `)
        if (nome == "") {
            resposta.write(`
               <div class="alert alert-danger m-2" role="alert">
                 Por favor, informe um Nome válido.
                </div>`);
        }
        resposta.write(`
        </div>

                        <!-- \  Nome \ -->

                        <!-- / E-mail / -->
                        <div class="col-md-12">
                            <label for="nome" class="form-label">E-mail:</label>
                            <input type="text" class="form-control" id="email" name="email" required>`)
        if (email == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe E-mail válido.
             </div>`);
        }
        resposta.write(`
        </div>
        <!-- \ E-mail \ -->

        <!-- / Telefone / -->
        <div class="col-md-12">
            <label for="nome" class="form-label">Telefone:</label>
            <input type="text" class="form-control" id="telefone" name="telefone" required>`)
        if (telefone == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe um Telefone válido.
             </div>`);
        }
        resposta.write(` </div>
        <!-- \ Telefone \ -->

        <div class="row mb-3 mt-5">
            <div class="col-6 d-grid gap-2">
                <a class="btn btn-block btn-secondary" href="/">Voltar</a>
            </div>
            <div class="col-6 d-grid gap-2">
                <button class="btn btn-block btn-primary" type="submit"
                    style="border-color: #012030; background-color: #012030;">Cadastrar</button>
            </div>
        </div>
    </form>
</div>
</div>
</div>
</div>
<!-- End of Page Wrapper -->
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
crossorigin="anonymous"></script>

</html>`)
        resposta.end();
    }
}

function cadastrarPets(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const idade = requisicao.body.idade;
    const raca = requisicao.body.raca;

    //verificando se os campos foram preenchidos (não estão vazios)
    if (nome && idade && raca) {
        listaPets.push({
            nome: nome,
            idade: idade,
            raca: raca,
        });
        resposta.redirect('/listarPet');
    } else {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página de cadastro de Pets</title>
            <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        
            <link
                href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                rel="stylesheet">
        
            <link rel="stylesheet" href="css/sb-admin-2.min.css">
        
            <link rel="stylesheet" href="css/itens.css">
        </head>
        
        <body>
            <!-- Page Wrapper -->
            <div id="wrapper">
        
                <!-- Sidebar -->
                <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        
                    <!-- Sidebar - Brand -->
                    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                        <div class="sidebar-brand-icon rotate-n-15">
                            <i class="fas fa-laugh-wink"></i>
                        </div>
                        <div class="sidebar-brand-text mx-3">
                            <img src="https://img.freepik.com/vetores-gratis/pata-de-design-de-logotipo-de-animal-de-estimacao-vetor-para-loja-de-animais_53876-136741.jpg"
                                alt="AdminLTE Logo" width="30" height="30" class="brand-image img-circle elevation-3 mr-1"
                                style="opacity: .8">
                            <span>Pet Shop</span>
        
                        </div>
                    </a>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider my-0">
        
                    <!-- Nav Item - Dashboard -->
                    <li class="nav-item active">
                        <a class="nav-link" href="index.html">
                            <i class="fa fa-tachometer"></i>
                            <span>Dashboard</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Cadastro
                    </div>
        
                    <!-- Nav Item - Tables -->
                    <li class="nav-item">
                        <a class="nav-link" href="cadastroInterresados.html">
                            <i class="fa fa-user-o"></i>
                            <span>Interessados</span></a>
                    </li>
        
                    <li class="nav-item">
                        <a class="nav-link" href="cadastroPets.html">
                            <i class="fa fa-paw"></i>
                            <span>Pets</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Listagem
                    </div>
        
                    <!-- Nav Item - Tables -->
                    <li class="nav-item">
                        <a class="nav-link" href="/listarInterresado">
                            <i class="fa fa-user-o"></i>
                            <span>Interessados</span></a>
                    </li>
        
                    <li class="nav-item">
                        <a class="nav-link" href="/listarPet">
                            <i class="fa fa-paw"></i>
                            <span>Pets</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Adote
                    </div>
        
                    <!-- Nav Item - Charts -->
                    <li class="nav-item">
                        <a class="nav-link" href="/adotarPet">
                            <i class="fa fa-paw"></i>
                            <span>Adote um pet</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <li class="nav-item">
                        <a class="nav-link" href="/logout">
                            <i class="fa fa-sign-out"></i>
                            <span>Sair</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider d-none d-md-block">
        
                </ul>
                <!-- End of Sidebar -->
        
                <div class="row">
                    <div class="col-9 offset-1">
                        <div class="container m-5 rounded text-start form-cadastro-interressados">
        
                            <form method="POST" action='/cadastrarPet' class="row g-3 p-5 needs-validation" novalidate>
        
                                <h4>Cadastro de Pets</h4>
                                <hr>
        
                                <!-- / Nome / -->
                                <div class="col-md-12">
                                    <label for="nome" class="form-label">Nome:</label>
                                    <input type="text" class="form-control" id="nome" name="nome" required>`)
        if (nome == "") {
            resposta.write(`
               <div class="alert alert-danger m-2" role="alert">
                 Por favor, informe um Nome válido.
                </div>`);
        }
        resposta.write(`
        </div>

        <!-- \  Nome \ -->

        <!-- / Idade / -->
        <div class="col-md-12">
            <label for="nome" class="form-label">Idade:</label>
            <input type="text" class="form-control" id="idade" name="idade" required>`)
        if (idade == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe uma Idade válida.
             </div>`);
        }
        resposta.write(`
        </div>
        <!-- \ Idade \ -->

        <!-- / Raça / -->
        <div class="col-md-12">
            <label for="nome" class="form-label">Raça:</label>
            <input type="text" class="form-control" id="raca" name="raca" required>`)
        if (raca == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe uma Raça válida.
             </div>`);
        }
        resposta.write(`   </div>
        <!-- \ Raça \ -->

        <div class="row mb-3 mt-5">
            <div class="col-6 d-grid gap-2">
                <a class="btn btn-block btn-secondary" href="/">Voltar</a>
            </div>
            <div class="col-6 d-grid gap-2">
                <button class="btn btn-block btn-primary" type="submit"
                    style="border-color: #012030; background-color: #012030;">Cadastrar</button>
            </div>
        </div>
    </form>
</div>
</div>
</div>
</div>
<!-- End of Page Wrapper -->
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
crossorigin="anonymous"></script>

</html>`)
        resposta.end();
    }
}

function cadastrarInterresadoPet(requisicao, resposta) {
    const interresado = requisicao.body.interresado;
    const animal = requisicao.body.animal;
    const data = new Date();

    //verificando se os campos foram preenchidos (não estão vazios)
    if (interresado && animal && data) {
        listaInterresadosPet.push({
            interresado: interresado,
            animal: animal,
            data: data,
        });
        console.log(listaInterresadosPet);
        resposta.redirect('/listarInterresadosPet');
    } else {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página de cadastro de Pets</title>
            <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        
            <link
                href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                rel="stylesheet">
        
            <link rel="stylesheet" href="css/sb-admin-2.min.css">
        
            <link rel="stylesheet" href="css/itens.css">
        </head>
        
        <body>
            <!-- Page Wrapper -->
            <div id="wrapper">
        
                <!-- Sidebar -->
                <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        
                    <!-- Sidebar - Brand -->
                    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                        <div class="sidebar-brand-icon rotate-n-15">
                            <i class="fas fa-laugh-wink"></i>
                        </div>
                        <div class="sidebar-brand-text mx-3">
                            <img src="https://img.freepik.com/vetores-gratis/pata-de-design-de-logotipo-de-animal-de-estimacao-vetor-para-loja-de-animais_53876-136741.jpg"
                                alt="AdminLTE Logo" width="30" height="30" class="brand-image img-circle elevation-3 mr-1"
                                style="opacity: .8">
                            <span>Pet Shop</span>
        
                        </div>
                    </a>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider my-0">
        
                    <!-- Nav Item - Dashboard -->
                    <li class="nav-item active">
                        <a class="nav-link" href="index.html">
                            <i class="fa fa-tachometer"></i>
                            <span>Dashboard</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Cadastro
                    </div>
        
                    <!-- Nav Item - Tables -->
                    <li class="nav-item">
                        <a class="nav-link" href="cadastroInterresados.html">
                            <i class="fa fa-user-o"></i>
                            <span>Interessados</span></a>
                    </li>
        
                    <li class="nav-item">
                        <a class="nav-link" href="cadastroPets.html">
                            <i class="fa fa-paw"></i>
                            <span>Pets</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Listagem
                    </div>
        
                    <!-- Nav Item - Tables -->
                    <li class="nav-item">
                        <a class="nav-link" href="/listarInterresado">
                            <i class="fa fa-user-o"></i>
                            <span>Interessados</span></a>
                    </li>
        
                    <li class="nav-item">
                        <a class="nav-link" href="/listarPet">
                            <i class="fa fa-paw"></i>
                            <span>Pets</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <!-- Heading -->
                    <div class="sidebar-heading">
                        Adote
                    </div>
        
                    <!-- Nav Item - Charts -->
                    <li class="nav-item">
                        <a class="nav-link" href="/adotarPet">
                            <i class="fa fa-paw"></i>
                            <span>Adote um pet</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider">
        
                    <li class="nav-item">
                        <a class="nav-link" href="/logout">
                            <i class="fa fa-sign-out"></i>
                            <span>Sair</span></a>
                    </li>
        
                    <!-- Divider -->
                    <hr class="sidebar-divider d-none d-md-block">
        
                </ul>
                <!-- End of Sidebar -->
        
                <div class="row">
                    <div class="col-9 offset-1">
                        <div class="container m-5 rounded text-start form-cadastro-interressados">
        
                            <form method="POST" action='/cadastrarPet' class="row g-3 p-5 needs-validation" novalidate>
        
                                <h4>Cadastro de Pets</h4>
                                <hr>
        
                                <!-- / Nome / -->
                                <div class="col-md-12">
                                    <label for="nome" class="form-label">Nome:</label>
                                    <input type="text" class="form-control" id="nome" name="nome" required>`)
        if (nome == "") {
            resposta.write(`
               <div class="alert alert-danger m-2" role="alert">
                 Por favor, informe um Nome válido.
                </div>`);
        }
        resposta.write(`
        </div>

        <!-- \  Nome \ -->

        <!-- / Idade / -->
        <div class="col-md-12">
            <label for="nome" class="form-label">Idade:</label>
            <input type="text" class="form-control" id="idade" name="idade" required>`)
        if (idade == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe uma Idade válida.
             </div>`);
        }
        resposta.write(`
        </div>
        <!-- \ Idade \ -->

        <!-- / Raça / -->
        <div class="col-md-12">
            <label for="nome" class="form-label">Raça:</label>
            <input type="text" class="form-control" id="raca" name="raca" required>`)
        if (raca == "") {
            resposta.write(`
            <div class="alert alert-danger m-2" role="alert">
              Por favor, informe uma Raça válida.
             </div>`);
        }
        resposta.write(`   </div>
        <!-- \ Raça \ -->

        <div class="row mb-3 mt-5">
            <div class="col-6 d-grid gap-2">
                <a class="btn btn-block btn-secondary" href="/">Voltar</a>
            </div>
            <div class="col-6 d-grid gap-2">
                <button class="btn btn-block btn-primary" type="submit"
                    style="border-color: #012030; background-color: #012030;">Cadastrar</button>
            </div>
        </div>
    </form>
</div>
</div>
</div>
</div>
<!-- End of Page Wrapper -->
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

app.post('/cadastrarInterresado', usuarioEstaAutenticado, cadastrarInterresados);
app.post('/cadastrarPet', usuarioEstaAutenticado, cadastrarPets);
app.post('/adotarPet', usuarioEstaAutenticado, cadastrarInterresadoPet);

app.get('/listarInterresadosPet', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página de cadastro de Interresado</title>
        <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">
    
        <link rel="stylesheet" href="css/sb-admin-2.min.css">
    
        <link rel="stylesheet" href="css/itens.css">
    </head>
    
    <body>
        <!-- Page Wrapper -->
        <div id="wrapper">
    
            <!-- Sidebar -->
            <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
    
                <!-- Sidebar - Brand -->
                <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div class="sidebar-brand-icon rotate-n-15">
                        <i class="fas fa-laugh-wink"></i>
                    </div>
                    <div class="sidebar-brand-text mx-3">
                        <img src="https://img.freepik.com/vetores-gratis/pata-de-design-de-logotipo-de-animal-de-estimacao-vetor-para-loja-de-animais_53876-136741.jpg"
                            alt="AdminLTE Logo" width="30" height="30" class="brand-image img-circle elevation-3 mr-1"
                            style="opacity: .8">
                        <span>Pet Shop</span>
    
                    </div>
                </a>
    
                <!-- Divider -->
                <hr class="sidebar-divider my-0">
    
                <!-- Nav Item - Dashboard -->
                <li class="nav-item active">
                    <a class="nav-link" href="index.html">
                        <i class="fa fa-tachometer"></i>
                        <span>Dashboard</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Cadastro
                </div>
    
                <!-- Nav Item - Tables -->
                <li class="nav-item">
                    <a class="nav-link" href="cadastroInterresados.html">
                        <i class="fa fa-user-o"></i>
                        <span>Interessados</span></a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link" href="cadastroPets.html">
                        <i class="fa fa-paw"></i>
                        <span>Pets</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Listagem
                </div>
    
                <!-- Nav Item - Tables -->
                <li class="nav-item">
                    <a class="nav-link" href="/listarInterresado">
                        <i class="fa fa-user-o"></i>
                        <span>Interessados</span></a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link" href="/listarPet">
                        <i class="fa fa-paw"></i>
                        <span>Pets</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Adote
                </div>
    
                <!-- Nav Item - Charts -->
                <li class="nav-item">
                    <a class="nav-link" href="/adotarPet">
                        <i class="fa fa-paw"></i>
                        <span>Adote um pet</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <li class="nav-item">
                    <a class="nav-link" href="/logout">
                        <i class="fa fa-sign-out"></i>
                        <span>Sair</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider d-none d-md-block">
    
            </ul>
            <!-- End of Sidebar -->`);
    resp.write(`
            <div class="row">
            <div class="col-9 offset-1">
                <div class="container m-5 rounded text-start">
                <div class="row g-3 p-5">
                <h4>Listagem de Interresados</h4>
                <hr>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th style="width: 200px">Interresado</th>
                                <th style="width: 200px">Animal</th>
                                <th style="width: 200px">Data</th>
                            </tr>
                        </thead>
                        <tbody>
            `);
    for (let i = 0; i < listaInterresadosPet.length; i++) {
        resp.write('<tr>');
        resp.write(`<td style="width: 200px">${listaInterresadosPet[i].interresado}</td>`);
        resp.write(`<td style="width: 200px">${listaInterresadosPet[i].animal}</td>`);
        resp.write(`<td style="width: 200px">${listaInterresadosPet[i].data}</td>`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('</div>');

    resp.write(`
    </div>
    </div>
    </div>
    <!-- End of Page Wrapper -->
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    crossorigin="anonymous"></script>
</html>
    `);
});

app.get('/listarInterresado', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página de cadastro de Interresado</title>
        <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">
    
        <link rel="stylesheet" href="css/sb-admin-2.min.css">
    
        <link rel="stylesheet" href="css/itens.css">
    </head>
    
    <body>
        <!-- Page Wrapper -->
        <div id="wrapper">
    
            <!-- Sidebar -->
            <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
    
                <!-- Sidebar - Brand -->
                <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div class="sidebar-brand-icon rotate-n-15">
                        <i class="fas fa-laugh-wink"></i>
                    </div>
                    <div class="sidebar-brand-text mx-3">
                        <img src="https://img.freepik.com/vetores-gratis/pata-de-design-de-logotipo-de-animal-de-estimacao-vetor-para-loja-de-animais_53876-136741.jpg"
                            alt="AdminLTE Logo" width="30" height="30" class="brand-image img-circle elevation-3 mr-1"
                            style="opacity: .8">
                        <span>Pet Shop</span>
    
                    </div>
                </a>
    
                <!-- Divider -->
                <hr class="sidebar-divider my-0">
    
                <!-- Nav Item - Dashboard -->
                <li class="nav-item active">
                    <a class="nav-link" href="index.html">
                        <i class="fa fa-tachometer"></i>
                        <span>Dashboard</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Cadastro
                </div>
    
                <!-- Nav Item - Tables -->
                <li class="nav-item">
                    <a class="nav-link" href="cadastroInterresados.html">
                        <i class="fa fa-user-o"></i>
                        <span>Interessados</span></a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link" href="cadastroPets.html">
                        <i class="fa fa-paw"></i>
                        <span>Pets</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Listagem
                </div>
    
                <!-- Nav Item - Tables -->
                <li class="nav-item">
                    <a class="nav-link" href="/listarInterresado">
                        <i class="fa fa-user-o"></i>
                        <span>Interessados</span></a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link" href="/listarPet">
                        <i class="fa fa-paw"></i>
                        <span>Pets</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Adote
                </div>
    
                <!-- Nav Item - Charts -->
                <li class="nav-item">
                    <a class="nav-link" href="/adotarPet">
                        <i class="fa fa-paw"></i>
                        <span>Adote um pet</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <li class="nav-item">
                    <a class="nav-link" href="/logout">
                        <i class="fa fa-sign-out"></i>
                        <span>Sair</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider d-none d-md-block">
    
            </ul>
            <!-- End of Sidebar -->`);
    resp.write(`
            <div class="row">
            <div class="col-9 offset-1">
                <div class="container m-5 rounded text-start">
                <div class="row g-3 p-5">
                <h4>Listagem de Interresados</h4>
                <hr>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th style="width: 200px">Nome</th>
                                <th style="width: 200px">E-mail</th>
                                <th style="width: 200px">Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
            `);
    for (let i = 0; i < listaInterressados.length; i++) {
        resp.write('<tr>');
        resp.write(`<td style="width: 200px">${listaInterressados[i].nome}</td>`);
        resp.write(`<td style="width: 200px">${listaInterressados[i].email}</td>`);
        resp.write(`<td style="width: 200px">${listaInterressados[i].telefone}</td>`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('</div>');

    resp.write(`
    </div>
    </div>
    </div>
    <!-- End of Page Wrapper -->
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    crossorigin="anonymous"></script>
</html>
    `);
});

app.get('/listarPet', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página de cadastro de Interresado</title>
    <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">

    <link rel="stylesheet" href="css/sb-admin-2.min.css">

    <link rel="stylesheet" href="css/itens.css">
</head>

<body>
    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                <div class="sidebar-brand-icon rotate-n-15">
                    <i class="fas fa-laugh-wink"></i>
                </div>
                <div class="sidebar-brand-text mx-3">
                    <img src="https://img.freepik.com/vetores-gratis/pata-de-design-de-logotipo-de-animal-de-estimacao-vetor-para-loja-de-animais_53876-136741.jpg"
                        alt="AdminLTE Logo" width="30" height="30" class="brand-image img-circle elevation-3 mr-1"
                        style="opacity: .8">
                    <span>Pet Shop</span>

                </div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item active">
                <a class="nav-link" href="index.html">
                    <i class="fa fa-tachometer"></i>
                    <span>Dashboard</span></a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <!-- Heading -->
            <div class="sidebar-heading">
                Cadastro
            </div>

            <!-- Nav Item - Tables -->
            <li class="nav-item">
                <a class="nav-link" href="cadastroInterresados.html">
                    <i class="fa fa-user-o"></i>
                    <span>Interessados</span></a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="cadastroPets.html">
                    <i class="fa fa-paw"></i>
                    <span>Pets</span></a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <!-- Heading -->
            <div class="sidebar-heading">
                Listagem
            </div>

            <!-- Nav Item - Tables -->
            <li class="nav-item">
                <a class="nav-link" href="/listarInterresado">
                    <i class="fa fa-user-o"></i>
                    <span>Interessados</span></a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="/listarPet">
                    <i class="fa fa-paw"></i>
                    <span>Pets</span></a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <!-- Heading -->
            <div class="sidebar-heading">
                Adote
            </div>

            <!-- Nav Item - Charts -->
            <li class="nav-item">
                <a class="nav-link" href="/adotarPet">
                    <i class="fa fa-paw"></i>
                    <span>Adote um pet</span></a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <li class="nav-item">
                <a class="nav-link" href="/logout">
                    <i class="fa fa-sign-out"></i>
                    <span>Sair</span></a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider d-none d-md-block">

        </ul>
        <!-- End of Sidebar -->
    `);
    resp.write(`
    <div class="row">
    <div class="col-9 offset-1">
        <div class="container m-5 rounded text-start">
        <div class="row g-3 p-5">
        <h4>Listagem de Pets</h4>
        <hr>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 200px">Nome</th>
                        <th style="width: 200px">Idade</th>
                        <th style="width: 200px">Raça</th>
                    </tr>
                </thead>
                <tbody>
    `);
    for (let i = 0; i < listaPets.length; i++) {
        resp.write('<tr>');
        resp.write(`<td style="width: 200px">${listaPets[i].nome}</td>`);
        resp.write(`<td style="width: 200px">${listaPets[i].idade}</td>`);
        resp.write(`<td style="width: 200px">${listaPets[i].raca}</td>`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('</div>');

    resp.write(`
    </div>
    </div>
    </div>
    <!-- End of Page Wrapper -->
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    crossorigin="anonymous"></script>

</html>
    `);

    resp.end();
});


app.get('/adotarPet', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página de cadastro de Interresado</title>
        <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">
    
        <link rel="stylesheet" href="css/sb-admin-2.min.css">
    
        <link rel="stylesheet" href="css/itens.css">
    </head>
    
    <body>
        <!-- Page Wrapper -->
        <div id="wrapper">
    
            <!-- Sidebar -->
            <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
    
                <!-- Sidebar - Brand -->
                <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div class="sidebar-brand-icon rotate-n-15">
                        <i class="fas fa-laugh-wink"></i>
                    </div>
                    <div class="sidebar-brand-text mx-3">
                        <img src="https://img.freepik.com/vetores-gratis/pata-de-design-de-logotipo-de-animal-de-estimacao-vetor-para-loja-de-animais_53876-136741.jpg"
                            alt="AdminLTE Logo" width="30" height="30" class="brand-image img-circle elevation-3 mr-1"
                            style="opacity: .8">
                        <span>Pet Shop</span>
    
                    </div>
                </a>
    
                <!-- Divider -->
                <hr class="sidebar-divider my-0">
    
                <!-- Nav Item - Dashboard -->
                <li class="nav-item active">
                    <a class="nav-link" href="index.html">
                        <i class="fa fa-tachometer"></i>
                        <span>Dashboard</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Cadastro
                </div>
    
                <!-- Nav Item - Tables -->
                <li class="nav-item">
                    <a class="nav-link" href="cadastroInterresados.html">
                        <i class="fa fa-user-o"></i>
                        <span>Interessados</span></a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link" href="cadastroPets.html">
                        <i class="fa fa-paw"></i>
                        <span>Pets</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Listagem
                </div>
    
                <!-- Nav Item - Tables -->
                <li class="nav-item">
                    <a class="nav-link" href="/listarInterresado">
                        <i class="fa fa-user-o"></i>
                        <span>Interessados</span></a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link" href="/listarPet">
                        <i class="fa fa-paw"></i>
                        <span>Pets</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <!-- Heading -->
                <div class="sidebar-heading">
                    Adote
                </div>
    
                <!-- Nav Item - Charts -->
                <li class="nav-item">
                    <a class="nav-link" href="/adotarPet">
                        <i class="fa fa-paw"></i>
                        <span>Adote um pet</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider">
    
                <li class="nav-item">
                    <a class="nav-link" href="/logout">
                        <i class="fa fa-sign-out"></i>
                        <span>Sair</span></a>
                </li>
    
                <!-- Divider -->
                <hr class="sidebar-divider d-none d-md-block">
    
            </ul>
            <!-- End of Sidebar -->
    
            <div class="row">
                <div class="col-9 offset-1">
                    <div class="container m-5 rounded text-start form-cadastro-interressados">
    
                        <form method="POST" action='/adotarPet' class="row g-3 p-5 needs-validation" novalidate>
    
                            <h4>Adotar um Pet</h4>
                            <hr>
    
                            <!-- / Interresado / -->
                            <div class="col-md-12">
                                <label for="interresado" class="form-label">Interresado:</label>
                                <select class="form-control" name="interresado" id="interresado">`)
    for (let i = 0; i < listaInterressados.length; i++) {
        resp.write(`<option class="form-control" value="${listaInterressados[i].nome}">${listaInterressados[i].nome}</option>`);
    }
    resp.write(`
    </select>
    </div>
    <!-- / Animal / -->
    <div class="col-md-12">
    <label for="animal" class="form-label">Animal:</label>
    <select class="form-control" name="animal" id="animal">
    `)
    for (let i = 0; i < listaPets.length; i++) {
        resp.write(`<option class="form-control" value="${listaPets[i].nome}">${listaPets[i].nome}</option>`);
    }
    resp.write(`
    </select>
    </div>
    <div class="row mb-3 mt-5">
    <div class="col-6 d-grid gap-2">
        <a class="btn btn-block btn-secondary" href="/">Voltar</a>
    </div>
    <div class="col-6 d-grid gap-2">
        <button class="btn btn-block btn-primary" type="submit"
            style="border-color: #012030; background-color: #012030;">Cadastrar</button>
    </div>
</div>
</form>
</div>
</div>
</div>
</div>
<!-- End of Page Wrapper -->
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
crossorigin="anonymous"></script>

</html>
    `)
})

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})