let fs   = require('fs'),
    env = {
      envs: require('./env.json'),
      writeEnv: function(prettify, key, value, match, prop) {
        if(key&&value) {
          prop = `"${key}": "${value}"`, match=str.match(new RegExp(`"${key}":\s*[^,\s]+`, 'g')),

          str=str.split(match).join(prop), str.charAt(str.length-1) !=='}'&&(str+'}'),
          !match&&(str=str.replace(/\}$/, `,${prop}}`))
        } else str = JSON.stringify(env.envs);

        prettify&&(str=str.replace(/(,|\{|\})/g, a=>a==='}'?'\n'+a:a+'\n\t')),
        fs.writeFile('./env.json', str, function() {

        })
      }
    },
    str  = JSON.stringify(env.envs);

module.exports = env   
