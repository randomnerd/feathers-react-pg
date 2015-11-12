import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import fc from './feathers/client';
window.fc = new fc();
ReactDOM.render(<App />, document.getElementById('root'));
