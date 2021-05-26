const http = require('http');
const https = require('https');

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

module.exports.getJSON = (options, onResult) => {

  const port = options.port == 443 ? https : http;

  let output = '';

  const req = port.request(options, (res) => {
    console.log(`Peticion a ${options.host} : ${res.statusCode}`);
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      output += chunk;
    });

    res.on('end', () => {

        try{
            onResult(res.statusCode, JSON.parse(output));
        } catch (e){
            onResult(res.statusCode, output);
        }
    });
  });

  req.on('error', (err) => {
    // res.send('error: ' + err.message);
  });

  req.end();
};