let fs        = require('fs');

module.exports = views= {
  signed: function(req, res, result){
    console.log('views.signed', result)
    let {email, username} = result[0]
    req.headers['sec-fetch-dest'].match(/iframe/)
    ? 
    res.send('You are temporarily seeing this because it is in an iframe, try visiting /sign in a new tab to see your dashboard') : res.redirect('/dashboard')
  },
  cached: {},
  fromFile: function(filePath, obj, cb) {
    new Promise((res, rej, str)=>(str = views.cached[filePath]) ? res(str) : fs.readFile(filePath, (err, buffer)=>err?rej(err):res(buffer.toString())))
    .then(file=>{
      for(let key in obj) {
        val = obj[key],
        file = file.replace(((key = key.split(/^RE::/)).length===1
          ? key[0]
          : new RegExp(key[1])), val);
      }
      cb(file)
    })
  }
}

// function loop (str, props, from, to, cb) {
  
//   from = Math.abs(props['from'])||0, to = Math.abs(props['to'])||0, cb = props['cb'];
//   if(typeof cb !== 'function') cb =_=>!!0;
//   let result = [''], has=!0, reach = from+to, down = props['back'];
  
//   for(; !cb(str, from, to, result)&&(to?from < reach:has);) {
//     result[0] += (has=str[result[1] = down?from--:from++])||'';

//     if(down&&to&&from===to) break;
//   }
//   if(down) result[0] = result[0].split('').reverse().join(''), result[1] &&= ++result[1];
//   return result
// }