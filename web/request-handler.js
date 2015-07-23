var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var fetch = function (filePath, res) {
    var absPath = path.resolve(__dirname, filePath);
    fs.readFile(absPath, function(err, data) {
      if (err) {
        res.statusCode = 404;
        res.end("Oops.");
      } else {
        res.end(data);
      }
    });
  };

  if (req.url === '/download') {
    archive.downloadUrls("www.google.com");
  }

  var ext = path.extname(req.url);
  if (ext === '.html' || ext === '.css' || ext === '.js') {
    fetch(archive.paths.siteAssets + req.url, res);
  } else if (req.url === '/' && req.method === "GET") {
    fetch(archive.paths.siteAssets + 'index.html', res);
  } else if (req.method === "GET") {
    var siteName = req.url.slice(1);
    fetch(archive.paths.archivedSites + siteName, res);
  } else if (req.method === "POST") {
    var body = '';
    req.on('data', function(piece) {
      body += piece;
    });
    console.log(body);
    req.on('end', function() {
      body = JSON.parse(body);
      archive.addUrlToList(body.url, function(){
        res.statusCode = 302;
        res.end();
      });
    });
  }


    
  
};
