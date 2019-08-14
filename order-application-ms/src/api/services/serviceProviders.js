const request = require('request');

exports.payment = async (accessToken, body) => {
  const paymentHost = process.env.PAYMENT_URI || 'http://localhost:4000';
  const url = `${paymentHost}/v1/payment`;

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
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
