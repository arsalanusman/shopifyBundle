const express = require('express')
var MongoClient = require("mongodb").MongoClient;
const app = express()
var bodyParser = require('body-parser');
ObjectId = require('mongodb').ObjectID;

app.use(bodyParser());
// Enable CORS for all methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});
const port = 3001
var db;

// Initialize connection once
MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", {useUnifiedTopology: true}, function(err, database) {
    if(err) throw err;
    db = database.db('simple_bundle')
    // Start the application after the database connection is ready
    app.listen(port);
    console.log("Listening on port "+ port);
});


app.get('/', (req, res) => {
    db.collection('bundles').find({}).toArray()
        .then(result => {
            res.send(result)
        })
        .catch(error => console.error(error))

})

app.post('/add_bundle', (req, res) => {
    db.collection('bundles').insertMany(req.body)
        .then(result => {
            res.json({success: 'post call succeed!', url: req.url, body: req.body})
        })
        .catch(error => console.error(error))

})
app.put('/add_bundle', (req, res) => {
    db.collection('bundles').update({"_id":ObjectId(req.body.id)},
        { $set: { internal_name: req.body.internal_name, name: req.body.name, products: req.body.products} })
        .then(result => {
            res.json({success: 'post call succeed!', url: req.url, body: result})
        })
        .catch(error => console.error(error))

})
app.post('/get_bundle', (req, res) => {
    db.collection('bundles').findOne({"_id":ObjectId(req.body.id)})
        .then(result => {
            res.json({success: 'post call succeed!', url: req.url, body:result})
        })
        .catch(error => console.error(error))
})

app.post('/remove_bundle', (req, res) => {
    console.log(req.body._id)
    db.collection('bundles').deleteOne( { "_id" : ObjectId(req.body.id) })
        .then(result => {
            res.json({success: 'post call succeed!', url: req.url})
        })
        .catch(error => console.error(error))

})
