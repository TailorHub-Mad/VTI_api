const apiBenchmark = require('api-benchmark');
const fs = require('fs');

const services = {
  server1: 'http://localhost:3001/api/'
};
const options = {
  minSamples: 100
};

const routeWithoutCache = {
  route1: {
    method: 'get',
    route: 'projects'
  }
};
const routeWithCache = {
  route1: {
    method: 'get',
    route: 'projects'
  }
};

apiBenchmark.measure(services, routeWithoutCache, options, function (_err, results) {
  apiBenchmark.getHtml(results, function (_error, html) {
    fs.writeFile('no-cache-results.html', html, function (err) {
      if (err) return console.log(err);
    });
  });
});

apiBenchmark.measure(services, routeWithCache, options, function (_err, results) {
  apiBenchmark.getHtml(results, function (_error, html) {
    fs.writeFile('cache-results.html', html, function (err) {
      if (err) return console.log(err);
    });
  });
});
