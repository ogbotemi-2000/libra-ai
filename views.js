module.exports = {
  signed: function(req, res, result){
    console.log('views.signed', result)
    let {email, username} = result[0]
    req.headers['sec-fetch-dest'].match(/iframe/) 
    ? 
    res.send('INTERIM - IN IFRAME') : res.redirect('/dashboard')
  },
  expired: _=>_,
  dash: function(result){
    let {email, username} = result, avatar = (username||email).slice(0, 1),
    html =
    `<html>
      <head>
      <meta http-equiv=refresh content=3>
      <link rel="stylesheet" href="css/tailwind.min.css">
      <link rel="stylesheet" href="css/utils.css">
      <head>
      <body>
      <main>
        <div class="text-center p-3">
          <strong class="align-middle text-7xl border rounded-full inline-block bg-red-300" style="min-height:98px; min-width:98px;/*font-size:clamp(2rem, 0.916rem + 3.86vw, 4rem)*/">
            ${avatar}
          </strong></div>
          ${username}
          <div class="text-center text-sm">
          ${email}
          ${username?'<hr class="inline-block border border-current bg-black align-middle p-0.5 mx-2.5 rounded-full">'+username:''}
        </div>
      </main>`;
    html+=`</body></html>`;
    
    return html;
  }
}