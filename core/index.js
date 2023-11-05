 let ccxt     = require('ccxt'),
    env      = require('../env.json'),
    exchange = new ccxt.binance({
      enableRateLimit: true,
      apiKey: env.API_KEY,
      secret: env.SECRET_KEY
    }),
    config   = {
      asset: 'BTC',
      base:  'USDT',
      allocation: 0.1,
      spread: 0.2,
      tickInterval:2000
    },
    tick = async ()=>{
      let {asset, base, allocation, spread} = config, market = `${asset}/${base}`
	  orders  =  await exchange.fetchOpenOrders(market),
          results =  await Promise.all([
	    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
	    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
	  ]),
	  marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd,
	  //sell price, buy price
	  prices      = [0, 1].map(e=>marketPrice * (1 + (e?-1:1)*spread)),
	  balance     = exchange.fetchBalance(),
	  //asset, base balances
	  balances    = [0, 1].map(e=>balance.free[e?base:asset]),
	  sellVolume  = balances[0]*allocation,
	  buyVolulme  = balances[1]*allocation/marketPrice;
	  
      orders.forEach(async order=>{ await exchange.cancelOrder(order.id) }),
      await exchange.createLimitSellOrder(market, sellVolume, prices[0]),
      await exchange.createLimitBuyOrder(market, buyVolume, prices[1]);

      console.log(`
      New tick for ${market}...
      Created limit sell order for ${sellVolume}@${prices[0]}
      Created limit buy order for ${buyVolume}@${prices[0]}
      `)
    };

exchange.setSandboxMode(true),
tick()
//setInterval(tick, config.tickInterval, config, exchange)
