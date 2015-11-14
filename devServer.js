import path from 'path';
import feathers from 'feathers';
import hooks from 'feathers-hooks';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import config from './webpack.config.dev';

let app = feathers();
let compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.configure(feathers.rest())
  .configure(feathers.socketio())
  .configure(hooks())
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json());

require('./feathers/pg_setup')(app);
require('./feathers/auth_setup')(app);
require('./feathers/services')(app);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000, 'localhost', (err) => {
  if (err) { return console.log(err); };
  console.log('Listening at http://localhost:3000');
});
