import $ from 'jquery'; 
import Popper from 'popper.js'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Core JS Files
//import 'material-dashboard/assets/js/core/bootstrap-material-design.min.js';
//import 'material-dashboard/assets/js/plugins/perfect-scrollbar.jquery.min.js';
// Chartist JS 
//import 'material-dashboard/assets/js/plugins/chartist.min.js';
// Notifications Plugin    
//import 'material-dashboard/assets/js/plugins/bootstrap-notify.js';
// Control Center for Material Dashboard: parallax effects, scripts for the example pages etc 
//import 'material-dashboard/assets/js/material-dashboard.js';

import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import App from './router';
import { Provider } from 'react-redux';



ReactDOM.render(
  <Provider store={store}>
    <App />
    
  </Provider>,
  document.getElementById('app')
);
