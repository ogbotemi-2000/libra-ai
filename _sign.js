let path   = require('path'),
	db	 	   = require('./db'),
  {compare, hash} = require('./password'),
  views    = require('./views'),  
	sign 	   = {
	  up: function(data, res, viaIframe, users) {
      users = {"email":data[0][1], "username":''},
        db.on('pooled', function(connection) {
          console.log('connected as id ' + connection.threadId)
      }),
      hash(data[1][1]).then(hashed=>{
        users.password = hashed,
        console.log('USER', users)
        db.query('INSERT INTO users SET ?', users, function (error, results, fields) {
          if (error) {
            res.send({"code":400,error})
          } else {
            viaIframe 
            ? res.send(`<div class='dots-6'></div>You are temporarily seeing this because it is in an iframe, try visiting /sign in a new tab to see your dashboard`)
            : res.send({"code":200, "success":"user registered sucessfully", results, error, fields })
          }
        })
      })
	  }
	};
  
module.exports = function(req, res, next) {
	//incoming data will be small, hence no need for req.on('end')
	req.on('data', function(data, which, viaIframe) {
		data=decodeURIComponent(data).split('&'),
		which = data.shift().split('=')[1].toLowerCase(),
		viaIframe = +data.shift().split('=')[1],
		data = data.filter(e=>new RegExp('^'+which).test(e)).map(e=>e.split('=')),
		sign[which](data, res, viaIframe)
	})
};

sign.in = function(data, res, viaIframe, which) {
  data = data.map(e=>e[1])
  db.query(`SELECT id, email, password, username FROM users WHERE email = ?`, data[0], function(err, result){
    let {id, email, password} = result[0];
    compare(data[1], password).then(bool=>{
      if(bool) res.redirect('/dashboard') /* res.send(`<!DOCTYPE html>
        <html>
          <head>
            <link rel=stylesheet href="css/utils.css"/>
            <link rel='stylesheet' href="css/tailwind.min.css"/>
          </head>
          <body>
            <a href='/dashboard' class='text-center text-blue-400'>/dashboard</a>
            id: ${id}
            <div class='dots-6'></div>
          </body>
        </html>`)
        */
        // session.refresh(id, session.refresh_token(64), res).then(uid=>{
        //   viaIframe?res.send('INTERIM'):res.redirect('/dashboard')
        // });
      else views.fromFile('./sign.html', {
        '<!--login-message-->':'The information provided has no match in our records',
        'RE::\\/\\*,\\s*set[^]+\\*\\/':match=>{
          return match.replace(/\/\*|\*\//g, '');
        },
        'RE::<\\!--<div class="rounded-lg[^]+-->':(match)=>{
          return match.replace(/<\!--|-->/g, '')
        }
      }, file=>res.send(file))
    })
  })
}

// app.get("/users/:userId/books/:bookId", (req, res) => {
// 	// Access userId via: req.params.userId
// 	// Access bookId via: req.params.bookId
// 	res.send(req.params);
// });
//users/34/books/8989
