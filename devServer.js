import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.dev';

let app = express();
let compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use('/static', express.static(__dirname + '/static'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000, 'localhost', (err) => {
  if (err) { return console.log(err); };
  console.log('Listening at http://localhost:3000');
});
