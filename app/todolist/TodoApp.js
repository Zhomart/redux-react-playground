const React = require('react');

const { connect } = require('react-redux');


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
const addTodo = (text) => {
    return {
      type: 'ADD_TODO',
      text: text,
      id: nextTodoId++
    }
}

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
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

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
}

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  };
}

const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList)

// class VisibleTodoList extends React.Component {
//   componentDidMount() {
//     this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate())
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//
//   todoClick(id) {
//     this.context.store.dispatch({
//       type: 'TOGGLE_TODO',
//       id
//     })
//   }
//
//   render() {
//     const { store } = this.context;
//     const state = store.getState();
//
//     return (
//       <TodoList
//         todos={getVisibleTodos(state.todos, state.visibilityFilter)}
//         onTodoClick={this.todoClick.bind(this)}
//       />
//     );
//   }
// }
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// }

class AddTodo extends React.Component {

  addTodo() {
    this.props.dispatch(addTodo(this.input.value));
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

AddTodo = connect()(AddTodo);

const Link = ({active, children, onClick, filter}) => {
  if (active){
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

const mapStateToLinkProps = (state, props) => {
  return {
    active: props.filter === state.visibilityFilter
  }
}

const mapDispatchToLinkProps = (dispatch) => {
  return {
    onClick: (filter) => {
      dispatch(setVisibilityFilter(filter))
    }
  }
}

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link)

// class FilterLink extends React.Component {
//   componentDidMount() {
//     this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate())
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//
//   onClick() {
//     this.context.store.dispatch({
//       type: 'SET_VISIBILITY_FILTER',
//       filter: this.props.filter
//     })
//   }
//
//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();
//
//     return (
//       <Link
//         active={props.filter === state.visibilityFilter}
//         onClick={this.onClick.bind(this)}
//       >
//         {props.children}
//       </Link>
//     );
//   }
// }
// FilterLink.contextTypes = {
//   store: React.PropTypes.object
// }


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

const TodoApp = ({ store }) => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  );
}


module.exports = TodoApp
