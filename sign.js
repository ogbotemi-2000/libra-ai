let path    = require('path'),
	db	 	= require('./db'),
	session = require('./session'),
	sign 	= {
	  up:function(data, res, users) {
		users = {"email":data[0][1], "password":btoa(data[1][1]), "username":''}
		console.log('SIGNING UP::', this, data);
		  db.on('pooled', function(connection) {
		    console.log('connected as id ' + connection.threadId)
		}),
		  db.query('INSERT INTO users SET ?', users, function (error, results, fields) {
			if (error) {
				res.send({
				"code":400,
				"failed":"error ocurred",
				error
				})
			} else {
				res.send({
					"code":200,
					"success":"user registered sucessfully",
					results,
					error,
					fields
				});
			}
		  })
		}
	};

module.exports = function(req, res, next) {
	//incoming data will be small, hence no need for req.on('end')
	req.on('data', function(data, which, viaIframe) {
		data=decodeURIComponent(data).split('&'),
		which = data.shift().split('=')[1].toLowerCase(),
		viaIframe = /iframe/.test(req.headers['sec-fetch-dest']),
		data = data.filter(e=>new RegExp('^'+which).test(e)).map(e=>e.split('=')),
		sign[which](data, res, viaIframe)
	})
};

sign.in = function(data, res, viaIframe) {
  data = data.map(e=>e[1]),
  db.query(`SELECT id, email, password, username FROM users WHERE ${db.column(data[0])} = ?`, data[0], function(err, result){
	if(result&&result.length) {
		let {id, email, password, username} = result[0];
		session.refresh(id, session.refresh_token(64), res).then(uid=>{
		  viaIframe?res.send('INTERIM'):res.redirect('/dashboard')
		})
	}
  })
}

// app.get("/users/:userId/books/:bookId", (req, res) => {
// 	// Access userId via: req.params.userId
// 	// Access bookId via: req.params.bookId
// 	res.send(req.params);
// });
//users/34/books/8989
