const express = require('express');
const trackRoute = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const { Readable } = require('stream');


// Create Express server and Express Router config
const app = express();
app.use('/tickets', trackRoute);

// Body handler middleware
app.use(bodyParser.urlencoded({extended: true}))

//Connect Mongo Driver to MongoDB
let db;
MongoClient.connect('mongodb://client:tickett0ken@ds247670.mlab.com:47670/tiktokclientdb', (err, client) => {
  if (err) return console.log(err);
  db = client.db('tiktokclientdb'); // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});


app.get('/view', (req, res) => {
  //grab tickets from mongo
  //send back json of all the tickets 
  db.collection('tickets').find().toArray(function(err, results) {
  	if (err) throw err;
  	console.log(results);
  	res.json(results);
  })

  res.json(tickets);
})

app.post('/upload', (req, res) => {
	console.log('hit the upload request')
})
*/

app.listen(3000, function() {
  console.log('listening on 3000')
});