const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Create Express server and Express Router config
const app = express();
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Body handler middleware
app.use(bodyParser.urlencoded({extended: true}))

//Connect Mongo Driver to MongoDB
let db;
MongoClient.connect('mongodb://client:tickett0ken@ds247670.mlab.com:47670/tiktokclientdb', (err, client) => {
  if (err) return console.log(err);
  db = client.db('tiktokclientdb'); // whatever your database name is
  app.listen(3000, () => { //TODO change based on environemnt prod vs. dev
    console.log('listening on 3000');
  });
});

var storage = multer.diskStorage({
  destination: './uploads',
  filename: function(req, file, callback) {
    console.log(file)
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})


app.get('/api/file', (req, res) => {
  res.render('index')
});

app.post('/generate', function(req, res) {
  
  var upload = multer({
    storage: storage
  }).single('audiofile')

  console.log("PRINTING SHIT")
  console.log(upload)

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
      return res.redirect('/generate');
    }
    console.log()
    var ticketObj = {
      name: req.body.name, 
      price: req.body.price,
      numTickets: req.body.numTickets,
      filename: ''
    }

    ticketObj.filename = req.file.filename;

    console.log(ticketObj);
    //TODO save this to DB

    res.redirect('/views');
  });
});

//App Handlers 

/* Get Homepage */
app.get('/view', (req, res) => {
  //grab all songs available in mongo (title, status - owned/notowned/created, trackid)
  //send back json of this info
  //render a ejs that takes the json and make the ui 
  db.collection('tickets').find().toArray(function(err, results) {
  	if (err) throw err;
  	console.log(results);
  	res.json(results);
  })

  res.json(tickets);
})

app.get('/generate', (req, res) => {
  res.render('generate')
})

/*
app.post('/generate', function(req, res) {
  var upload = multer({
    storage: storage
  }).single('userFile')
  upload(req, res, function(err) {
    res.end('File is uploaded')
  })
})
*/

/* Get Track */
app.get('/:trackid', (req, res) => {
  //render a page with the right track to listen
})

