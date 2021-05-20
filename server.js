const http = require('http'),
      url = require('url'),
      fs = require('fs');

http.createServer((request, response) => {
  let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => { //adds requests to a log that is viewable by the developer
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
      filePath = 'index.html'; // if the requested URL doesn't exist, this returns user to homepage
  }
  
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');
