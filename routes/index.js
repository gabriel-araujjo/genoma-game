var path = require('path');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.answers = function(req, res){
	var d = Date.now();
	console.log(d, req);
	if(req.param('pswd') < d+200 && req.param('pswd') > d-200){
		res.download(path.join(__dirname, '../answers.json'));
	}else{
		res.send('no answers!');
	}
}
