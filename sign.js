let path    		 	   = require('path'),
    express			 	   = require("express"),
    app     		 	   = express(),
		jwt				 	   = require('jsonwebtoken'),
		redis			 	   = require('redis'),
		secret			 	   = '3c458ea2ba35c08d0758106f3d52797630f92f8c915c04e2670201032ac477bc73bbd9',
		// creating 24 hours from milliseconds
		oneDay			 	   = 1000 * 60 * 60 * 24,
		redisCl			 	   = redis.createClient(),
		jwt_secret 		 	   = "jwtfanhere",
		jwt_expiration 	 	   = 60 * 10,
		jwt_refresh_expiration = 60 * 60 * 24 * 30,
		mysql = require('mysql2'),
		pool  = mysql.createPool({
			connectionLimit : 10,
			host            : 'localhost',
			user            : 'root',
			password        : '2#@Are_1',
			database        : 'sys'
		}),
	
		/**
		 * Templates called into connection.query
		 * `INSERT INTO programming_languages 
    (name, released_year, githut_rank, pypl_rank, tiobe_rank) 
    VALUES 
    ('${programmingLanguage.name}', ${programmingLanguage.released_year}, ${programmingLanguage.githut_rank}, ${programmingLanguage.pypl_rank}, ${programmingLanguage.tiobe_rank})`

		`UPDATE programming_languages 
    SET name="${programmingLanguage.name}", released_year=${programmingLanguage.released_year}, githut_rank=${programmingLanguage.githut_rank}, 
    pypl_rank=${programmingLanguage.pypl_rank}, tiobe_rank=${programmingLanguage.tiobe_rank} 
    WHERE id=${id}` 

		`DELETE FROM programming_languages WHERE id=${id}`

		Store Procedures (created in the database)
		----------------
		DELIMITER $$
CREATE PROCEDURE `sp_search_programming_languages_by_id`(in langid int)
BEGIN
    SELECT name, githut_rank, pypl_rank, tiobe_rank, created_at
    FROM programming_languages
    where id = langid;
END $$

		 */
		sign = {
			up:function(data, res) {
				console.log('SIGNING UP::', this, data);
				pool.getConnection((err, connection) => {
					if(err) throw err;

					console.log('connected as id ' + connection.threadId)
					connection.connect(function(err){
						if(err) console.error('Error in connecting database...', err);
					})
					connection.query('SELECT * from users', (err, rows) => {
					  connection.release() // return the connection to pool
						if (err) {
							console.log(err)
						} else {
							res.send(rows)
						}
					})
				})
	
	
			}
		};


module.exports = function(req, res, next) {
	//incoming data will be small, hence no need for req.on('end')
	req.on('data', function(data, which) {
		data=decodeURIComponent(data).split('&'),
		which = data.shift().split('=')[1].toLowerCase(),
		data = data.filter(e=>new RegExp('^'+which).test(e)),
		sign[which](data, res)
	})
};
sign.in = function(data) {
		console.log('SIGNING IN::', data)
}

app.get("/users/:userId/books/:bookId", (req, res) => {
	// Access userId via: req.params.userId
	// Access bookId via: req.params.bookId
	res.send(req.params);
});
//users/34/books/8989
