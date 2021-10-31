const start = async function() {
    // import needed libs
    var MongoClient = require('mongodb').MongoClient;
    const fetch = require('node-fetch');
    var net = require('net');
    var gini = require("gini");
    var express = require("express");
    var cors = require('cors')
        // connect to mongodb
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // open the DB
        var dbo = db.db("rsexplorer");

        var client = new net.Socket(); // create a new socket to connect to the avrio-daemon RPC server
        var init = false;
        client.connect(44405, '127.0.0.1', function() {
            console.log('Connected to rpc');
            client.write('init'); // write first message to the daemon

        });

        var app = express(); // launch the API app
        app.use(cors()) // open the API to everyone
        var tot_json = `[`
        app.listen(1234, () => {
            console.log("API running on port 1234");
        });


        app.get("/lastten", (req, res, next) => { // gets the last ten blocks
            let blocks_cursor = dbo.collection("blocks").find().sort({ _id: -1 }).limit(10);

            blocks_cursor.toArray().then(array => {
                res.json(array);
            })
        })

        app.get("/chaincount", (req, res, next) => { // gets the number of chains/
            fetch(`http://127.0.0.1:8000/api/v1/chainlist`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    if (myJson['success'] == true) {
                        res.json({ count: myJson['list'].length })
                    } else {
                        console.log("Failed to get chain count from node")
                        res.json({ count: 0 })
                    }
                })
        })

        app.get("/get_mem_tx/:hash", (req, res, next) => { // gets the number of chains/
            try {
            fetch(`http://127.0.0.1:8000/json_api/get_tx/${req.params.hash}`)
            
                .then(function(response) {
                    if (response != null) {
                    return response.json();
                    }

                })
                .then(function(myJson) {
                    if (myJson != null) {

                    if (myJson['success'] == true) {
                        res.json({ count: myJson['list'].length })
                    } else {
                        console.log("Failed to get chain count from node")
                        res.json({ count: 0 })
                    }
                }
                })
            }
            catch {
                function resolved(result) {
                    console.log('Resolved');
                }
                  
                function rejected(result) {
                    console.error(result);
                }
                  
                Promise.reject(new Error('fail')).then(resolved, rejected);
                
            }
        })
        app.get("/get_acc/:hash", (req, res, next) => { // gets the number of chains/
            try {
            fetch(`http://127.0.0.1:8000/json_api/get_acc/${req.params.hash}`)
                .then(function(response) {
                    try {
                    return response.json();
                    }
                    catch {
                        res.status(401).json("Invalid credentials!")
                    }
                    console.log(1)

                })
                .then(function(myJson) {
                    //0x9ec672b9957a57b6862056feb9d7c32903b5501f
                    console.log(2)

                        if (myJson['success'] == true) {
                            console.log(3)
                            try {
                            res.json(myJson)
                            }
                            catch {
                                res.status(401).json("Invalid credentials!")
                            }
                        } else {
                            console.log(33)

                            console.log("Failed to get chain count from node")
                        }
                    
                    
                })
            }
            catch {
                console.log('That did not go well.')
                res.status(401).json("Invalid credentials!")
            }
        })
        app.get("/block/:hash", (req, res, next) => { // gets a block by its hash
            let blocks_cursor = dbo.collection("blocks").find({ hash: req.params.hash });

            blocks_cursor.toArray().then(array => {
                if (typeof array[0] != 'undefined') {
                    console.log(array[0]);
                    res.json(array[0]);
                } else {
                    fetch(`http://127.0.0.1:8000/json_api/get_blk/${req.params.hash}`)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(myJson) {
                            console.log(myJson);
                            if (myJson['success'] == true) {
                                res.json(myJson['response']['block'])
                            } else {
                                console.log("Failed to get block from node")
                                res.json([])
                            }
                        })
                };
            });
        })
        app.get("/tx/:hash", (req, res, next) => { // gets a block by its hash
            let transactions_cursor = dbo.collection("transactions").find({ hash: req.params.hash });

            transactions_cursor.toArray().then(array => {
                if (typeof array[0] != 'undefined') {
                    console.log(array[0]);
                    res.json(array[0]);
                } else {
                    fetch(`http://127.0.0.1:8000/json_api/get_blk/${req.params.hash}`)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(myJson) {
                            console.log(myJson);
                            if (myJson['success'] == true) {
                                res.json(myJson['response']['block'])
                            } else {
                                console.log("Failed to get block from node")
                                res.json([])
                            }
                        })
                };
            });
        })
        app.get("/acc_history_rec/:account", (req, res, next) => {            
            let transactions_cursor = dbo.collection("transactions").find({ reciver: req.params.account });
            transactions_cursor.toArray().then(array => {
                console.log(array);
                res.json(array);
            })
        });
        app.get("/acc_history_sender/:account", (req, res, next) => {
            let transactions_cursor = dbo.collection("transactions").find({ sender: req.params.account });
            transactions_cursor.toArray().then(array => {
                console.log(array);
                res.json(array);
            })
        });

        client.on('data', function(data) { // when we recieve data from the RPC
            console.log('Received: ' + data);
            if (!init) { // is this the first message recieved?
                console.log("Not init, sending *");
                client.write('*'); // register all services
                init = true; // set init to true
            } else { // we have already registered all services, parse the data
                var rec = JSON.parse(data) // we only listen for blocks for now
                if (rec.m_type == "block") {
                    var block = JSON.parse(rec.content)
                    dbo.collection("blocks").insertOne(block, function(err, res) { // save the block
                        if (err) throw err;
                        console.log(`1 block with hash=${block['hash']} inserted`);
                    });
                    // save each transaction in a block by its hash
                    // get block transactions in to array
                    //var txs = block['transactions']
                    for (var i = 0; i < block['transactions'].length; i++) {
                        var tx = block['transactions'][i];
                        if (block['transactions'][i]['sender'] != "coinbase") {
                            let addr = block['transactions'][i]['sender']
                            fetch(`http://127.0.0.1:8000/json_api/pk_to_acc/${addr}`)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(myJson) {
                                if (myJson != null) {
                                    let send_addr = myJson['address']
                                    tx.sender = send_addr;
                                    console.log(tx)
                                    dbo.collection("transactions").insertOne(tx, function(err, res) {
                                        if (err) throw err;
                                        console.log(`1 tx with hash=${tx['hash']} inserted`);
                                    });
                                } else {
                                    console.log("Failed to get address from node")
                                }
                            })
                        } 
                    }
                    if (block.block_type = "Send") {
                        let new_json = `{hash:${block.hash}, time: ${block.header.timestamp}, public_key: ${block.header.chain_key}, links: [ {hash: ${block.header.prev_hash}, type: 0 } ] },`

                        tot_json = tot_json + new_json
                    } else {
                        let new_json = `{hash:${block.hash}, time: ${block.header.timestamp}, public_key: ${block.header.chain_key}, links: [ {hash: ${block.header.prev_hash}, type: 0 }, {hash: ${block.send_block}, type: 1 } ] },`
                        tot_json = tot_json + new_json
                    }
                } else {
                    console.log(`Recieved non block msg, type=${rec.m_type}`)
                }
            }
        });

        client.on('close', function() {
            console.log('rpc closed');
        });
    });
}

  // expected output: Error: fail
try {
start();
}
catch {
    res.status(401).json("Invalid credentials!")
}