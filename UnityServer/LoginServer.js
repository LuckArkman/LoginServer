const express = require('express');
const bodyParse = require('body-parser');
const mysql = require('mysql');
const validator = require('validator');

//#region Configuration //
var port = process.env.PORT || 3000;

const app = express();

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

app.listen(port, ()=>
{
    console.log(`Listering Port ${port}`);
});

//#region Mysql Connection
var connection = mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"3702959",
        database:"User",
        port: 3306,
    });
//#endregion

//#region StartDBConnection
connection.connect(function(err)
{
    if(err)
    {
        console.log("Error Connecting : " + err.stack);
    }

    console.log("Connection DB Sucess");
});

//#endregion



//#region Function Get
app.get('/', function(req, res)
{
    console.log('Passando no: Entrando no Get/');
    res.send("Welcome");
});
//#endregion

//#region Function Login
app.get('/login/:email/:password', function(req, res)
{
    console.log("Passando no: entrando no Get login");

    var error = false;
    var msg_res = {};
    msg_res.status = 200;
    msg_res.message = '';

    var login_temp = {};
    login_temp.email = req.params.email;
    login_temp.password = req.params.password;

    //console.log(login_temp);

    var status = 200;
    var message = '';

    
    if(!validator.isEmail(login_temp.email))
    {
        status = 200;
        message = 'E-mail em formato invalido !';
        error = true;
    }
    if(!error)
    {
        loginSelect(login_temp).then((results)=>
        {
            console.log('Passando no: Login >> loginSelect.then()');

            if(parseInt(results.length) == 0)
            {
                console.log('Passando no: Login >> loginSelect.then() >> Verificando Resultado == 0');
                message = 'O Email ou Password informado está incorreto, verifique é tente novamente !';
                msg_res.message = message;
            }
            
            if(parseInt(results.length) > 1)
            {
                console.log('Passando no: Login >> loginSelect.then() >> Verificando Resultado > 0');
                message = 'Um erro foi identificado, entre em contato para solucionar este problema !';
                msg_res.message = message;
            }

            if(parseInt(results.length) == 1)
            {
                console.log('Passando no: Login >> loginSelect.then() >> Verificando Resultado == 1');
                
            }
            
            res.status(msg_res.status).json(msg_res);
        }).catch((err) =>
        {
            console.log('Passando no: Login >> loginSelect.Catch()');
            if(err)
            {
                msg_res.message = err.message;

            }
            else
            {
                msg_res.status = err.status;
                msg_res.message = 'Não é possivél se connectar, tente novamente em alguns Minutos !';
            }

            console.log('___>>> Login -Catch- error');

            res.status(msg_res.status).json(msg_res);
        });
    }
    else
    {
        msg_res.status = status;
        msg_res.message = message;
    

        res.status(msg_res.status).json(msg_res);
    }
});
//#endregion

//#region Function Register
app.post('/register', function(req, res)
{
    console.log("Passando no: entrando no Register");
    var error = false;
    var msg_res = {};
    msg_res.status = 200;
    msg_res.message = "";

    var login_temp = {};
    login_temp = req.body;
    /*
    login_temp.email = req.body.email;
    login_temp.password = req.body.password;
    */
    console.log(login_temp);
    var message = '';

    
    if(!validator.isEmail(login_temp.email))
    {
        message = 'E-mail em formato invalido !';
        error = true;
    }
    if(!error)
    {
        RegisterSelect(login_temp).then((results)=>
        {
            console.log('Passando no: RegisterSelect >> RegisterSelect.then()');

            if(results.length > 0)
            {
                console.log('Passando no: RegisterSelect >> RegisterSelect.then() > Verifica Resultado maior que Zero');
                message = 'Este endereço de Email já se encontra cadastrado em nossos bancos de dados';                
                msg_res.message = message;

                res.status(msg_res.status).json(msg_res);
            }
            else
            {
                RegisterInsert(login_temp).then((result) =>
                {
                    console.log('Passando no: RegisterInsert >> RegisterInsert.then()');
                    
                    message = result.message;
                    msg_res.message = message;

                    res.status(msg_res.status).json(msg_res);
                }).catch((err)=>
                {
                    console.log('Passando no: RegisterInser >> RegisterInsert.Catch()');
                    if(err.status)
                    {
                        message = err.message;
                        msg_res.message = message;
                        res.status(msg_res.status).json(msg_res);
                    }
                    else
                    {
                        console.log('Passando no Register - RegisterInsert.then()');
                    }
                    console.log('___>>> RegisterInsert -Catch- error' + msg_res.message);

                    res.status(msg_res.status).json(msg_res);
                });
            }

            
        }).catch((error) =>
        {
            console.log('Passando no: Register >> RegisterSelect.Catch()');
            if(error.status)
            {
                msg_res.message = error.message;
            }
            else
            {
                msg_res.message ='Passando no Register - RegisterSelect- Catch- erro no then';
            }
            console.log('___>>> Register -Catch- error' + msg_res.message);

            res.status(msg_res.status).json(msg_res);
        });
    }
    else
    {
        msg_res.message = message;
        res.status(msg_res.status).json(msg_res);
    }
});
//#endregion

//#region Promesse

function loginSelect(login_temp)
{
    return new Promise((resolve, reject) =>
    {
        console.log('Antes da Query');
        connection.query(`SELECT * FROM Login WHERE  email = '${login_temp.email}' AND password = '${login_temp.password}'`, function(err, results, field)
        {
            var obj_error = {};
            obj_error.message = '--->>> login Select Não entrou no erro';

            if(err)
            {
                console.log('Erro dentro da Promessa');
                obj_error.status = 200;
                obj_error.message = err;
            }
            else
            {
                console.log('Dentro da Promisse --> Selecionado :' + results.length);
                resolve(results);
            }
        });
    });
}

function RegisterSelect(login_temp)
{
    return new Promise((resolve, reject) =>
    {
        connection.query(`SELECT * FROM Login WHERE  email = '${login_temp.email}' `, function(err, results, field)
        {
            var obj_error = {};
            obj_error.message = '--->>> Register Select Não entrou no erro';

            if(err)
            {
                console.log('Erro dentro da Promessa Select');
                obj_error.status = 200;
                message = err;
                msg_res.message = message;
                res.status(msg_res.status).json(msg_res);

            }
            else
            {
                console.log('Dentro da Promisse --> Selecionado :' + results.length);
                resolve(results);
            }
        });
    });
}

function RegisterInsert(login_temp)
{
    return new Promise((resolve, reject) =>
    {
        connection.query(`INSERT INTO Login (email, password) VALUES ('${login_temp.email}', '${login_temp.password}') `, function(err, results, field)
        {
            var obj_error = {};
            obj_error.message = '--->>> Register Insert Não entrou no erro';

            if(err)
            {
                console.log('Erro dentro da Promessa Insert');
                obj_error.status = 200;
                obj_error.message = err;
            }
            else
            {
                console.log('Dentro da Promisse --> Insert :' + results.length);
                resolve(results);
            }
        });
    });
}

//#endregion