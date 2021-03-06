var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

router.get('/', function (req, res) {
    console.log('router get was hit');
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('SELECT * FROM koalas;', function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making database query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    //console.log(result.rows);
                }
            });
        }
    });
});

router.post('/', function (req, res) {
    console.log('post route was hit');
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error connecting to database:', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('INSERT INTO koalas (name, gender, age, transfer_status, notes)VALUES ($1, $2, $3, $4, $5);',
                [req.body.name, req.body.gender, req.body.age, req.body.readyForTransfer, req.body.notes],
                function (errorMakingQuery, results) {
                    done();
                    if (errorMakingQuery) {
                        console.log('error making query:', errorMakingQuery)
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
     });
});

router.put('/:id', function(req, res){
    console.log(req.params.id);
    
    console.log('put route was hit');
    pool.connect(function (errorConnectingToDatabase, client, done){
        if (errorConnectingToDatabase){
            console.log('error connecting to database:', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query("UPDATE koalas SET transfer_status = 'Y' WHERE user_id = $1;", 
            [req.params.id],
            function(errorMakingQuery, result){
                if(errorMakingQuery){
                    console.log('Error making query:', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

module.exports = router;