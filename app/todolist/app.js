'use strict';

const Redux = require('redux');
const ReactDOM = require('react-dom');
const React = require('react');

const reducers = require('./reducers.js');

const store = Redux.createStore(reducers.todoApp);

let nextTodoId = 0;



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

class VisibleTodoList extends React.Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate())
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  todoClick(id) {
    store.dispatch({
      type: 'TOGGLE_TODO',
      id: id
    })
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={this.todoClick.bind(this)}
      />
    );
  }
}

class AddTodo extends React.Component {

  addTodo() {
    store.dispatch({
      type: 'ADD_TODO',
      text: this.input.value,
      id: nextTodoId++
    });
    this.input.value = '';
  }

  render() {
    return (
      <div>
        <input ref={node => {this.input = node}} onKeyPress={ e => e.charCode == 13 ? this.addTodo(this.input.value) : null} />
        <button onClick={ () => this.addTodo(this.input.value)}>
          Add Todo
        </button>
      </div>
    )
  }
}

const Link = ({active, children, onClick}) => {
  if (active){
    return <span>{children}</span>;
  }

  return (
    <a href='#'
        onClick={e => {
          e.preventDefault()
          onClick()
        }}>
        {children}
    </a>
  )
}

class FilterLink extends React.Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate())
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onClick() {
    store.dispatch({
      type: 'SET_VISIBILITY_FILTER',
      filter: this.props.filter
    })
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={props.filter === state.visibilityFilter}
        onClick={this.onClick.bind(this)}
      >
        {props.children}
      </Link>
    );
  }
}

const Footer = () => {
  return (
    <p>
      Show: {' '}
      <FilterLink filter='SHOW_ALL'>All</FilterLink>
      {' '}
      <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
      {' '}
      <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
    </p>
  )
}

const TodoApp = () => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  );
}


module.exports = {

  init() {
    ReactDOM.render(<TodoApp/>, document.getElementById('root'))
  }

}
