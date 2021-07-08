const apiBenchmark = require('api-benchmark');
const fs = require('fs');

const services = {
  VTI: 'http://localhost:3001/api/'
};
const options = {
  minSamples: 50
};

const routeWithoutCache = {
  'Todos los clientes': {
    method: 'get',
    route: 'clients'
  },
  'Clientes con paginación ': {
    method: 'get',
    route: 'clients?offset=0&limit=10'
  },
  'Un cliente': {
    method: 'get',
    route: 'clients/60ca31d23a9b1bba16659bf9'
  },
  'Todos los proyectos': {
    method: 'get',
    route: 'projects'
  },
  'Proyectos con paginación ': {
    method: 'get',
    route: 'projects?offset=0&limit=10'
  },
  'Un Proyecto': {
    method: 'get',
    route: 'projects/60ca31d73a9b1bba1665a793'
  },
  'Todos los sistemas de ensayo': {
    method: 'get',
    route: 'testSystem'
  },
  'Sistemas de ensayo con paginación ': {
    method: 'get',
    route: 'testSystem?offset=0&limit=10'
  },
  'Un sistema de ensayo': {
    method: 'get',
    route: 'testSystem/60ca31d23a9b1bba16659bfa'
  },
  'Todos los apuntes': {
    method: 'get',
    route: 'notes'
  },
  'Apuntes con paginación ': {
    method: 'get',
    route: 'notes?offset=0&limit=10'
  },
  'Un apunte': {
    method: 'get',
    route: 'notes/60ca31de3a9b1bba1665af44'
  },
  'Todos los tags de apuntes': {
    method: 'get',
    route: 'tag/notes'
  },
  'Tag de apuntes con paginación ': {
    method: 'get',
    route: 'tag/notes?offset=0&limit=10'
  },
  'Todos los tags de proyectos': {
    method: 'get',
    route: 'tag/projects'
  },
  'Tag de proyectos con paginación': {
    method: 'get',
    route: 'tag/projects?offset=0&limit=10'
  }
};

apiBenchmark.measure(services, routeWithoutCache, options, function (_err, results) {
  apiBenchmark.getHtml(results, function (_error, html) {
    fs.writeFile('no-cache-results.html', html, function (err) {
      if (err) return console.log(err);
    });
  });
});

// const routeWithCache = {
//   'reduce': {
//     method: 'post',
//     route: 'test'
//   },
//   'for': {
//     method: 'post',
//     route: 'test/cache'
//   },
// }

// apiBenchmark.measure(services, routeWithCache, options, function (_err, results) {
//   apiBenchmark.getHtml(results, function (_error, html) {
//     fs.writeFile('cache-results.html', html, function (err) {
//       if (err) return console.log(err);
//     });
//   });
// });
