const express = require('express');
//const trackRoute = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');
var ejs = require('ejs')
var path = require('path');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//const { Readable } = require('stream');


// Create Express server and Express Router config
const app = express();
//app.use('/tracks', trackRoute);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

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

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads')
  },
  filename: function(req, file, callback) {
    console.log(file)
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})


//Downloading and Streaming tracks handlers

/*
trackRoute.get('/:trackID', (req, res) => {
  try {
    var trackID = new ObjectID(req.params.trackID);
  } catch(err) {
    return res.status(400).json({message: "Invalid trackID in URL parameter"})
  }
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'tracks'
  });

  let downloadStream = bucket.openDownloadStream(trackId);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('error', () => {
    res.sendStatus(404);
  });

  downloadStream.on('end', () => {
    res.end();
  })l
});

trackRoute.post('/', (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
  upload.single('track')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Request Validation Failed" });
    } else if(!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }
    
    let trackName = req.body.name;
    
    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: 'tracks'
    });

    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on('finish', () => {
      return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
    });
  });
});

*/



app.get('/api/file', (req, res) => {
  res.render('index')
});

app.post('/api/file', function(req, res) {
  var upload = multer({
    storage: storage
  }).single('userFile')
  upload(req, res, function(err) {
    res.end('File is uploaded')
  })
})


//main web app handlers 

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

/*
app.listen(3000, function() { //set this to be based on environemnt
  console.log('listening on 3000')
});*/