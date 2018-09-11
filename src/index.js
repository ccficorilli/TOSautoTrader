import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import store from './store'

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>,
  document.getElementById('root')
);
//1. instll redux packages: redux react-redux redux-thunk redux-devtools-extension
//2. wrap our app in <provider />
//3. create a store and import it apply to Provider as store prop
//GOTO ./store/index.js
