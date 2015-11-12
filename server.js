/* eslint no-console: 0 */
import path from 'path';
// import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import feathers from 'feathers';
import pg from 'pg';
import Sequelize from 'sequelize';
import bodyParser from 'body-parser';
import PostService from './app/post_service';

import config from './webpack.config.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = feathers();
app.dbStr = 'postgres://localhost/lbtest';
app.pgcli = new pg.Client(app.dbStr);
app.pgcli.connect((err) => { if (err) throw err; });
app.db = new Sequelize(app.dbStr);

app.use(feathers.static(__dirname + '/dist'));

if (isDeveloping) {
  const compiler = webpack(config);

  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.configure(feathers.rest())
  .configure(feathers.socketio())
  .use(bodyParser.json())
  .use('posts', PostService);

app.listen(port, 'localhost', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
