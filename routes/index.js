var express = require('express');
var router  = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var URL     = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('index', { title: 'Node Meta Crawler' });
});

router.post('/', function(req, res) {
  var url = putFormatToUrl(req.body.url);
  request.get({uri: url}, function(error, response, body) {
    if (error || response.statusCode !== 200)
      return res.render('index', { error: 'Sorry! Could not parse your url, Please check your url.' });
    res.render('result', { metaTags: getMetaTags(body) });
  });
});

function putFormatToUrl (url) {
 return URL.parse(url).protocol ? url : "http://" + url;
}

function getMetaTags (body) {
 var parsedBody = cheerio.load(body);

 return {
   title:        parsedBody('title').text(),
   description:  parsedBody("meta[name='description']").attr('content'),
   author:       parsedBody("meta[name='author']").attr('content'),
   keywords:     parsedBody("meta[name='keywords']").attr('content'),
   fbImage:      parsedBody("meta[property='og:image']").attr('content')
 }
} 

module.exports = router;