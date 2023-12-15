let router   = require('express').Router(),
    fs	     = require('fs'),
    both     = require('./both'),
    db	     /*= require('./db'),*/
    password = require('./password'),
    views    = require('./views'),
    sign     = {router};

module.exports = sign;

router.get('/', (req, res, obj={})=>{
  views.fromFile('./sign.html', req.query['signin'] ? {
        "RE::\\/\\*,\\s*setTimeout\\(_=>[^]+\\*\\/":match=>match.replace(/\/\*|\*\//g, ''),
  }:{}, file=>res.send(file))
})

router.post('/', (req, res)=>{
  //incoming data will be small, hence no need for req.on('end')
	req.on('data', function(data, which, viaIframe) {
		data=decodeURIComponent(data).split('&'),
		which = data.shift().split('=')[1].toLowerCase(),
		viaIframe = +data.shift().split('=')[1],
		data = data.filter(e=>new RegExp('^'+which).test(e)).map(e=>e.split('=')),
		console.log(data, viaIframe, req.headers['sec-fetch-dest'])
		//sign[which](data, res, viaIframe)
	})
  res.send('<pre>	Validated without reason</pre>')
})

router.get('/exists', async function(req, res) {
//    let email, obj, which, column
    // , verify = await new Promise((rej, resolve)=>{
    //   https.get('https://app.elasticmail.com?apiKey=<API_KEY>', _res=>{
   	
    //   }),
    //   resolve('')
    // }).catch(console.log);
/*    for(let i in obj=req.query) which=(email = i).split('_')[0];

    column=both.validateEmail(obj[email])?'email':'username'; //db.column(obj[email]),
    db.exists('users', [column, obj[email]], function(err, result, meta){
      let len=result.length, message;
      
      switch(which) {
        case 'up':
          message = !len?'':"Sorry, that's taken: try a unique email"
        break;
        case 'in':
        message=len?'':'Perhaps you do not have an account yet'
      }
      res.send(message)
    })
*/
res.send('')
})
