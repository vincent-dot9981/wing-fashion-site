const https = require('https');

// First, let's try to call the ITeSHOP search API
const options = {
  hostname: 'api-hk.iteshop.com',
  path: '/api/product/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Referer': 'https://hk.iteshop.com/bit/sale'
  }
};

const reqData = JSON.stringify({
  pageNo: 1,
  pageSize: 100,
  storeId: 'BIT',
  category: 'sale'
});

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      if (parsed.data && parsed.data.list) {
        console.log('Total:', parsed.data.total);
        console.log('Items in response:', parsed.data.list.length);
        console.log('First item:', JSON.stringify(parsed.data.list[0]).substring(0, 200));
      } else {
        console.log('Response:', JSON.stringify(parsed).substring(0, 500));
      }
    } catch(e) {
      console.log('Raw:', data.substring(0, 500));
    }
  });
});

req.write(reqData);
req.end();
