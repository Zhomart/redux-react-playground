'use strict';

const Redux = require('redux');
const ReactDOM = require('react-dom');
const React = require('react');
const { Provider } = require('react-redux');

const reducers = require('./reducers.js');

const TodoApp = require('./TodoApp.js');

const store = Redux.createStore(reducers.todoApp);



module.exports = {

  init() {
    ReactDOM.render(
      <Provider store={store}>
        <TodoApp/>
      </Provider>,
      document.getElementById('root')
    )
  }

}
