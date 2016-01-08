'use strict';

const Redux = require('redux');
const ReactDOM = require('react-dom');
const React = require('react');

const reducers = require('./reducers.js');

const store = Redux.createStore(reducers.todoApp);


const FilterLink = ({filter, currentFilter, children}) => {
  if (filter === currentFilter){
    return <span>{children}</span>;
  }

  return (
    <a href='#'
        onClick={e => {
          e.preventDefault()
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: filter
          })
        }}>
        {children}
    </a>
  )
}


const getVisibleTodos = (todos, filter) => {
    switch (filter) {
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
      default:
        return todos;
    }
}


let nextTodoId = 0;
class TodoApp extends React.Component {

  addTodo() {
    store.dispatch({
      type: 'ADD_TODO',
      text: this.input.value,
      id: nextTodoId++
    });
    this.input.value = "";
  }

  btnClick(event){
    this.addTodo()
  }

  todoClick(todo){
    store.dispatch({
      type: 'TOGGLE_TODO',
      id: todo.id
    })
  }

  inputKeyPress(e){
    if (e.charCode === 13){
      this.addTodo()
    }
  }

  render(){
    const {
      todos,
      visibilityFilter
    } = this.props;

    const visibleTodos = getVisibleTodos(todos, visibilityFilter);

    return (
      <div>
        <input ref={node => {this.input = node}} onKeyPress={this.inputKeyPress.bind(this)} />
        <button onClick={this.btnClick.bind(this)}>
          Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo =>
            <li key={todo.id}
                onClick={this.todoClick.bind(this, todo)}
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}>
              {todo.text}
            </li>
          )}
        </ul>

        <p>
          Show: {' '}
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>All</FilterLink>
          {' '}
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>Active</FilterLink>
          {' '}
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>Completed</FilterLink>
        </p>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
    />,
    document.getElementById('root')
  )
};



module.exports = {

  init() {
      store.subscribe(render);
      render();
  }

}
