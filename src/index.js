import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import { Account } from './Account/Account.context'
import { Provider } from 'react-redux'
import  store  from './state/store'

window.Popper = require("popper.js").default;
window.$ = window.jQuery = require("jquery");


ReactDOM.render( <BrowserRouter>
                  <Provider store={store}>
                    <Account>
                      <App/>
                    </Account>
                  </Provider>
                </BrowserRouter> ,  document.getElementById('root') );


