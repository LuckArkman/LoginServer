const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const mysql = require('mysql');
const Schema = mongoose.Schema;
const app = express();

const port = '3000';

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

//Connect MongooDB
mongoose.connect('mongodb+srv://StudioWO:qwert3702959@cluster0.kdj6h.mongodb.net/test');

const object = [];
object.push(
    {
        positionx: 00,
        positiony: 00,
        positionz: 00,

    },
);

//Schema
const schema = new Schema
({
    email:
    {
        type: String,
        required:[true, 'Obrigatório o cadastro de um email!'],
        trim: true,
        unique: true,
    },
    password:
    {
        type:String,
        required:[true, 'Obrigatório o cadastro de um password!'],
        trim: true,
    },
    Score:
    {
        type:Number,
        trim: true,
    },
    active:
    {
        type:Boolean,
        required:[true],
    }    
});

const player = mongoose.model('player', schema);


//Function Get
app.get('/', function(req, res, next)
{
    res.status(200).send('Hello World');
});

//#region  Get All players
//player Info
app.get('/players', function(req, res, next)
{
    player.find(
    {

    }).then(data =>
    {
        if(data && data.length != 0)
        {
            res.status(200).send(data);
        }
        else
        {
            res.status(400).send( 
                {message: 'Não foi possivél localizar os usuários !!'
                });
        }
    }).catch(e =>
    {
        res.status(500).send(e);
    });
});
//#endregion

//#region Get Specific player

app.get('/players/:email', function(req, res, next)
{
    player.find(
    {
        email: req.params.email
    }).then(data =>
    {
        if(data && data != 0)
        {
            res.status(200).send(data);
        }
        else
        {
            res.status(204).send();
        }
    }).catch(e =>
    {
        res.status(400).send(e);
    });
});
//#endregion

//#region  Create player
//Player Create
app.post('/players', function(req, res, next)
{
    var temp = new player(req.body);

    temp.save().then(data  =>
    {
        if(data && data.length != 0)
        {
        res.status(200).send(
        {
            message: 'Done'
        });
        }
        else
        {
            res.status(400).send( 
                {message: 'Não foi possivél localizar o usuário !!'
                });
        }
    }).catch(e =>
    {
        res.status(400).send(
        {
            message: 'Erro',
            erro: e + ""
        });
    });


    
    //res.status(200).send('Done');
});
//#endregion

//#region  Update Password
//Player Update
app.put('/players/:email', function(req, res, next)
{
    var query =  {email: req.params.email};
    player.findOneAndUpdate(query, {password: req.body.password}, (erro, data)=>
    {
        if(erro)
        {
            res.status(500).send(erro);
        }
        else
        {
            if(data && data.length != 0)
            {
                res.status(202).send('Done');
            }
            else
            {
                res.status(204).send();
            }
        }

    });

});
//#endregion

//#region  Delete Account
//player Delete
app.delete('/players/:email', function(req, res, next)
{
    //res.status(200).send('Player Id' + ' = '+req.params.id);
    var query =  {email: req.params.email};
    var value = req.body;
    player.findOneAndDelete(query, value).then(data =>
    {
        if(data)
        {
            res.status(200).send('Done');
        }
        else
        {
            res.status(400).send( 
            {message: 'Não foi possivél localizar o usuário !!'
            });
        }
    }).catch( e =>
    {
        res.status(500).send(e);
    });
});
//#endregion

app.listen(port, function()
{
    console.log('Server Has Started : '+port +'...');
});
