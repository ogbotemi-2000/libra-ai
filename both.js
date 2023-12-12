//functions used both client side and server side goes here

let inBrowser=this.window,
both = {
  validateEmail:function(e) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(e);
  },
  uuid: function(a) { return (a ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.uuid)) },
  timeEqual: function(a,b) {
	var mismatch = !0;
	if(a.length !== b.length) return !mismatch;
	  for (var i = 0; i < a.length; ++i) {
		mismatch &&=a[i]===b[i]
	  }
	  return mismatch;
	}
}

if(!inBrowser) module.exports = both;
