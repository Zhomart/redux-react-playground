'use strict';

const Redux = require('redux');
const ReactDOM = require('react-dom');
const React = require('react');

const reducers = require('./reducers.js');

const store = Redux.createStore(reducers.todoApp);


const FilterLink = ({filter, currentFilter, onClick, children}) => {
  if (filter === currentFilter){
    return <span>{children}</span>;
  }

  return (
    <a href='#'
        onClick={e => {
          e.preventDefault()
          onClick(filter)
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


const Todo = ({
  onClick,
  completed,
  text
}) => {
  return (
    <li onClick={onClick}
        style={{
          textDecoration: completed ? 'line-through' : 'none'
        }}>
      {text}
    </li>
  )
}

const TodoList = ({
  todos,
  onTodoClick
}) => {
  return (
    <ul>
      {todos.map(todo =>
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
        />
      )}
    </ul>
  )
}

const AddTodo = ({addTodo}) => {
  let input;

  const AddTodoClear = (value) => {
    addTodo(value);
    input.value = '';
  }

  return (
    <div>
      <input ref={node => {input = node}} onKeyPress={ e => e.charCode == 13 ? AddTodoClear(input.value) : null} />
      <button onClick={ () => AddTodoClear(input.value)}>
        Add Todo
      </button>
    </div>
  )
}

const Footer = ({
  visibilityFilter,
  onFilterClick
}) => {
  return (
    <p>
      Show: {' '}
      <FilterLink filter='SHOW_ALL' onClick={onFilterClick} currentFilter={visibilityFilter}>All</FilterLink>
      {' '}
      <FilterLink filter='SHOW_ACTIVE' onClick={onFilterClick} currentFilter={visibilityFilter}>Active</FilterLink>
      {' '}
      <FilterLink filter='SHOW_COMPLETED' onClick={onFilterClick} currentFilter={visibilityFilter}>Completed</FilterLink>
    </p>
  )
}

let nextTodoId = 0;
const TodoApp = ({todos, visibilityFilter, addTodo, todoClick, filterClick}) => {

  const visibleTodos = getVisibleTodos(todos, visibilityFilter);

  return (
    <div>
      <AddTodo addTodo={addTodo} />

      <TodoList
        todos={visibleTodos}
        onTodoClick={todoClick}
      />

      <Footer
        visibilityFilter={visibilityFilter}
        onFilterClick={filterClick}
      />
    </div>
  );
}

const addTodo = (text) => {
  store.dispatch({
    type: 'ADD_TODO',
    text: text,
    id: nextTodoId++
  });
}

const todoClick = (id) => {
  store.dispatch({
    type: 'TOGGLE_TODO',
    id: id
  })
}

const filterClick = (filter) => {
   store.dispatch({
     type: 'SET_VISIBILITY_FILTER',
     filter
   })
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      addTodo={addTodo}
      todoClick={todoClick}
      filterClick={filterClick}
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
