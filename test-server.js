const express = require('express'),
      app     = express(),
      fs      = require('fs'),
      path    = require('path'),
      argv    = process.argv.slice(2),
      check   = (a, o, i)=>a[i]?.match(o[i/2]),
      defs    = ['./', 3000, './'],
      options = ['-a', '-p', '-d'],
      values  = {},
      msgs    =[];

defs.map((e, i)=>values[options[i]]=e);


for(let i = 0, arr=[], value, len=argv.length, match=_=>(_=_.match(rgx), _&&_[0]), rgx=new RegExp('^('+options.join('|')+')'); i < len;) {
  if(value=match(argv[i])) len&1&&match(argv[i+1])&&argv.splice(i, 1, ...[value, values[value]]), values[value]=path.normalize('./'+argv[i+1]);
  i+=2
};

/* slot in placeholder values here */
values['-a']==='_'&&(msgs.push(`-a :: replacing placeholder '_' with the value - '${values['-d']}' passed to -d`), values['-a'] = values['-d']),


/* check whether specified folder(s) exist and provide a default fallback otherwise */

['-d', '-a'].forEach(e=>{
  !fs.existsSync(values[e])&&(msgs.push(`${e}, :: ${values[e]}, is not a directory, defaulting to ${values[e]='./'}`))
}),

msgs.forEach(e=>console.log(e));

let served;
app.get('/', (req, res)=> {
  /*fullname of asset you want served in folder */
  
  served = values['-d']+'/' +req.query['f'],
  served = fs.existsSync(served)?served:(values['-d']+'/index.html'),
  console.log('/ endpoint', served),
  res.sendFile(served, {root:'./'})
}),

app.use(express.static(path.normalize(values['-a'])));

let port;
app.listen(port=+values['-p'], function() {
  console.log('Server listening on <PORT>', port, 'under <DIRECTORY>', values['-d'], 'and serving assets from <DIRECTORY>', values['-a']);
})
/** end of boilerplate code */

let sign         = require('./sign')

app.post('/sign', sign);

/*
app.get("/video", function (req, res) {
    const range = req.headers.range;
    console.log('RANGE::', range)
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "./media-cdn/input.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

*/