const Promise = require('bluebird');
const request = require('request-promise');

const rejectMissingArg = (argName) => Promise.reject(new Error(`Missing ${argName}`));

module.exports = ({apiKey = ''}) => {
  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  function _request(args) {
    return request.defaults({
      baseUrl: 'https://api.squarespace.com/1.0/commerce',
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'squarespace-node-api',
        'Authorization': `Bearer ${apiKey}`
      }
    })(args).promise();
  }

  return {
    get(url, qs = {}) {
      if (!url) {
        return rejectMissingArg('url');
      }

      return _request({url, method: 'GET', qs});
    },

    post(url, body) {
      if (!url) {
        return rejectMissingArg('url');
      }

      if (!body || !isEmptyObject(body)) {
        return rejectMissingArg('body');
      }

      return _request({url, method: 'POST', body});
    }
  };
};

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
