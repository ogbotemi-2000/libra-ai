let fs      = require('fs'),
    path    = require('path'),
    server  = {},
    express = require('express'),
    app     = express(),
    both    = require('./both'),
    env    = require('./env'),
    {envs, writeEnv} = env,
    sign   = require('./sign');

/* asynchronous operations done beforehand
*/
fs.readFile('./sign.html', function(err, buf){
  sign.page = buf.toString()
})

/*the route below is called when the website is about to be unloaded - exited */
app.get('/beforeunload', (req, res, str)=> {
  str = JSON.stringify(envs).replace(/UUID:\s+[^, \s]+/, 'UUID: '+envs.UUID)

})

app.get('/reid', (req, res, uuid, p='UUID')=>{
  if(!(uuid=req.query[p.toLowerCase()])) { res.end(); return;}

  if(both.timeEqual(uuid, envs[p])) res.send(uuid=envs[p]=both.uuid()), writeEnv(true);
  else res.send('Unrecognized ::HASH::');

})

//app.use((req, res, next)=>{
//   req.url = path.join('.', req.url),
//   //console.log(req.url, /*Object.keys(fs.createReadStream(req.url)),*/ req.query)
//   next()
// })

app.use(express.static('./'))
app.use('/sign', sign.router)

app.listen(3000, _=>console.log('Server listening on port '+3000))
