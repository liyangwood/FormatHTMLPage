var http = require('http'),
    url_mod = require('url'),
    fs = require('fs');

var util = require('../lib/util');

var log = util.log;

var readability2 = require('../lib/readability.js');
        
exports.cgi = function(req, res){
  	var param = req.query;

  	var url = url_mod.parse(param.url);
  	if(!url.host){
  		log.wrong(url+' is invaild');
  	}
  	else{
  		getContentByUrl(url, res);
  	}
};

function getContentByUrl(url, page){
	var req = http.request({
		host : url.host,
		method : 'get',
		port : '80',
		path : url.path
	}, function(res){
		res.setEncoding('utf8');
		var data = '';
		res.on('data', function(chunk){
			data += chunk;

		});
		res.on('end', function(){
			// console.log('------------------\n'+data+'\n--------------------');
			startFormat(data, page);

		});
	});
	req.end();
}

var F = {
	wrapContent: function(title, content) {
    	return '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8" /><title>' + title + '</title><link rel="stylesheet" type="text/css" media="all" /></head><body>' + content + '</body></html>'; 
    }
}; 


function startFormat(data, res){
	readability2.parse(data, '', {removeReadabilityArtifacts: false, removeClassNames: false, debug: false, profile: true}, 
		function(info) {
     		// log.ok(info.title);
     		res.charset = 'utf-8';
     		res.send(F.wrapContent(info.title, info.content));
   			res.end();
   		}

   	);
}
