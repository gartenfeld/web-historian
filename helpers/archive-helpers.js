var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public/'),
  archivedSites: path.join(__dirname, '../archives/sites/'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  fs.readFile(this.paths.list, 'utf-8', function (err, data) {
    if (err) throw err;
    var urls = data.split('\n') || [];
    return cb(urls);
  });
};

exports.isUrlInList = function(url, cb){
  cb(this.readListOfUrls(function (urls) {
    return _(urls).contains(url);
  }));
};

exports.addUrlToList = function(url, cb){
  var arch = this;
  this.isUrlInList(url, function (is){
    if (!is) {
      fs.appendFile(arch.paths.list, url + '\n', function (err) {
        if (err) throw err;
      });
    }
  });
  cb();
};

exports.isUrlArchived = function(url, cb){
  var files = fs.readdirSync(this.paths.archivedSites);
  cb(_(files).contains(url));
};

exports.downloadUrl = function(url) {
  var saveTo = path.join(__dirname, '../archives/sites/') + url;
  http.get(
    {
      url: 'http://' + url,
      progress: function (current, total) {
        console.log('Site: ' + url, '\t >> Downloaded ' + current + '/' + total);
      }
    }, 
    saveTo, 
    function (err, res) {
    }
  );
};

exports.downloadUrls = function(arr) {
  _(arr).each(this.downloadUrl);
};

exports.cronTask = function() {
  var helper = this;
  this.readListOfUrls(function(urls){
    helper.downloadUrls(urls);
  });  
};