var contentTypes    = require('./utils/content-types'),
    sysInfo         = require('./utils/sys-info'),
    fs              = require('fs'),
    env             = process.env,
    express         = require('express'),
    app             = express(),
    showdown        = require('showdown'),
    showdownVersion = JSON.parse(fs.readFileSync('./node_modules/showdown/package.json', 'utf8')).version,

    port            = env.NODE_PORT || 3000,
    host            = env.NODE_IP || 'localhost';

app.get('/', function (req, response) {
  response.json({
    title: 'showdown test API',
    api: {
      vanilla: '/vanilla?text=',
      github: '/github?text='
    }
  })
});

app.get('/health', function (req, response) {
  response.status(200);
  response.end();
});

app.get('/vanilla', function (request, response, next) {
  var converter = new showdown.Converter();
  var text = request.query.text;

  response.type('json');

  if (!text || text == '') {
    response.status(400).json({error: 'No text sent'});
  } else if (text.length > 1000) {
    response.status(400).json({error: 'Text > 1000 characters'});
  } else {
    converter.setFlavor('vanilla');
    var html = converter.makeHtml(text);
    response.json({
      name: 'showdown',
      html: html,
      version: showdownVersion
    });
  }
});

app.get('/github', function (request, response, next) {
  var converter = new showdown.Converter();
  var text = request.query.text;

  response.type('json');

  if (!text || text == '') {
    response.status(400).json({error: 'No text sent'});
  } else if (text.length > 1000) {
    response.status(400).json({error: 'Text > 1000 characters'});
  } else {
    converter.setFlavor('github');
    var html = converter.makeHtml(text);
    response.json({
      name: 'showdown (flavor: github)',
      html: html,
      version: showdownVersion
    });
  }
});

app.listen(port, host, function () {
  console.log('Application worker ' + process.pid + ' started on port ' + port + '...');
});
