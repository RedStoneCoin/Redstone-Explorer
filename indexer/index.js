const start = async function() {
    // import needed libs
    const fetch = require('node-fetch');
    var net = require('net');
    var gini = require("gini");
    var express = require("express");
    var cors = require('cors')
    var app = express(); // launch the API app
    app.use(cors()) // open the API to everyone
    var tot_json = `[`
    app.listen(1235, () => {
        console.log("API running on port 1235");
    });
    app.get("/create_wallet", (req, res, next) => { // gets the number of chains/
        fetch(`http://127.0.0.1:8000/json_api/create_wallet`)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                res.json(json);
            })
    })
    app.get("/from_key/:key", (req, res, next) => { // gets the number of chains/
        fetch(`http://127.0.0.1:8000/json_api/from_private_key/${req.params.key}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                res.json(json);
            })
    })
}

  // expected output: Error: fail
try {
start();
}
catch {
    res.status(401).json("Invalid credentials!")
}