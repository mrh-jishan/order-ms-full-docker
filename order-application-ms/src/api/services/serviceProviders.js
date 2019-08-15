const request = require('request');

exports.payment = async (accessToken, body) => {
  const paymentHost = process.env.PAYMENT_URI || '0.0.0.0:4000';
  const url = `http://${paymentHost}/v1/payment`;


  console.log('url------test--------->',url)
  const headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'content-type': 'application/json',
    Authorization: accessToken
  };

  const options = {
    url,
    method: 'POST',
    headers,
    body,
    json: true
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, data) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
