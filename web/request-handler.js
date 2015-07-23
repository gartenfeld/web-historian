var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var fetch = function (filePath, res) {
    var absPath = path.resolve(__dirname, filePath);
    console.log("Fetching: ", absPath);
    fs.readFile(absPath, function(err, data) {
      if (err) {
        res.statusCode = 404;
        res.end("Oops.");
      } else {
        console.log("Loaded file: " + absPath);
        res.end();
      }
    });
  };

  console.log("Request: " + req.method + ' ' + req.url);

  var ext = path.extname(req.url);
  if (ext === '.html' || ext === '.css' || ext === '.js') {
    fetch(archive.paths.siteAssets + req.url, res);
  } else if (req.url === '/' && req.method === "GET") {
    fetch(archive.paths.siteAssets + 'index.html', res);
  } else if (req.method === "GET") {
    var siteName = req.url.slice(1);
    fetch(archive.paths.archivedSites + siteName, res);
  } else if (req.method === "POST") {
    console.log ("Listening to POST request ...");
    var body = '';

    req.on('data', function(piece) {
      console.log("Receiving data ...");
      body += piece;
    });

    req.on('end', function() {
      console.log("POST data received: " + body);
      body = JSON.parse(body);
      res.statusCode = 302;
      
      archive.isUrlArchived(body.url, function (exists) {
        if (exists) {
          console.log("Checking: " + archive.paths.archivedSites + body.url);
          fetch(archive.paths.archivedSites + body.url, res);
        } else {
          console.log("Redirecting to: " + archive.paths.siteAssets + 'loading.html');
          fetch(archive.paths.siteAssets + 'loading.html', res);
        }
      });    

      archive.addUrlToList(body.url, function(){
        // res.end();
      });
    });
  }


    
  
};
