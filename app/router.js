import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'cerebral-router';
import {Container} from 'cerebral-react';
import controller from 'cerebral/controller';
import App from 'components/app';
require('cerebral/signals')(controller);

let routes = {
  '/': 'homeOpened',
  '/posts': 'postsOpened',
  '/posts/:id': 'postOpened',
  '/admin': 'adminHomeOpened'
};

// controller.signals.appStarted();
Router(controller, routes).trigger();

ReactDOM.render(<Container controller={controller} app={App} />, document.getElementById('root'));
