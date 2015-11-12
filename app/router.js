import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'cerebral-router';
import {Container} from 'cerebral-react';
import controller from 'cerebral/controller';
import App from 'components/app';
import setupSignals from 'cerebral/signals';

import fc from '../feathers/client';
window.fc = new fc();

setupSignals(controller);

let routes = {
  '/': 'homeOpened',
  '/admin': 'adminHomeOpened'
};

Router(controller, routes).trigger();

ReactDOM.render(<Container controller={controller} app={App} />, document.getElementById('root'));
