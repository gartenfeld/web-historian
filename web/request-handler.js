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

  var ext = path.extname(req.url)
  if (ext === '.html' || ext === '.css') {
    console.log("Fetching: " + req.url);
    fetch('./public/' + req.url, res);
  } else if (req.url === '/') {
    fetch('./public/index.html', res);
  } else if (req.method === "GET") {
    var siteName = req.url.slice(1);
    fetch('../archives/sites/' + siteName, res)
  } else if (req.method === "POST") {
    console.log ("post :" + ext);
    // fs.write('../archives/sites.text');
  }


    
  
};
