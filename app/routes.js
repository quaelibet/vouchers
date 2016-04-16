module.exports = function(app) {
  // front-end routes
  app.get('*', function(req, res) {
      res.sendFile('index.html', { root : __dirname + '/../public/views' }); // load our public/index.html file
  });

  // API routes
  // TO DO
}