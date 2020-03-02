import React, { useState } from "react"
import classnames from "classnames/bind"
import { observer } from "mobx-react"
import { useParams } from "react-router-dom"
import { NavLink } from "react-router-dom"

import styles from "./styles.module.scss"
import { RootInstance } from "./models/RootStore"

const cx = classnames.bind(styles)

interface TodoAppProps {
  store: RootInstance
}

interface AddTodoInputProps {
  onCreate: (label: string) => void
}

interface EditTodoInputProps {
  show: boolean
  value: string
  onBlur: () => void
  onChange: (label: string) => void
}

interface FilterTodosProps {
  activeTodosCount: number
  show: boolean
  onClearCompleted: () => void
}

const TodoApp: React.FC<TodoAppProps> = observer(props => {
  const todos = useFilteredTodos(props.store)

  return (
    <>
      <section className={cx("todoapp")}>
        <header className={cx("header")}>
          <h1>todos</h1>
          <AddTodoInput onCreate={props.store.addTodo}></AddTodoInput>
        </header>
        {/* <!-- This section should be hidden by default and shown when there are todos --> */}
        {Boolean(todos.length) && (
          <section className={cx("main")}>
            <input
              id="toggle-all"
              className={cx("toggle-all")}
              type="checkbox"
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className={cx("todo-list")}>
              {/* <!-- These are here just to show the structure of the list items --> */}
              {/* <!-- List items should get the class `editing` when editing and `completed` when marked as completed --> */}
              {todos.map(todo => {
                const editing = todo.id === props.store.editing
                const handleEditInputBlur = () => {
                  props.store.editTodo("")
                }
                const handleEditInputChange = (label: string) => {
                  todo.setLabel(label)
                }

                return (
                  <li
                    key={todo.id}
                    className={cx({ completed: todo.completed, editing })}
                  >
                    <div className={cx("view")}>
                      <input
                        className={cx("toggle")}
                        type="checkbox"
                        checked={todo.completed}
                        onChange={todo.toggle}
                      />
                      <label
                        onDoubleClick={() => props.store.editTodo(todo.id)}
                      >
                        {todo.label}
                      </label>
                      <button
                        className={cx("destroy")}
                        onClick={() => props.store.removeTodo(todo.id)}
                      ></button>
                    </div>

                    <EditTodoInput
                      show={editing}
                      value={todo.label}
                      onBlur={handleEditInputBlur}
                      onChange={handleEditInputChange}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        )}
        {/* <!-- This footer should hidden by default and shown when there are todos --> */}
        {
          <FilterTodos
            show={Boolean(props.store.todos.length)}
            activeTodosCount={props.store.activeTodosCount}
            onClearCompleted={props.store.clearCompletedTodos}
          ></FilterTodos>
        }
      </section>
      <footer className={cx("info")}>
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="https://manuphatak.com">Manu Phatak</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  )
})

export default TodoApp

function useFilteredTodos(store: RootInstance) {
  const { view } = useParams()

  switch (view) {
    case "active":
      return store.activeTodos
    case "completed":
      return store.completedTodos
    default:
      return store.todos
  }
}

const AddTodoInput: React.FC<AddTodoInputProps> = props => {
  const [input, setInput] = useState("")

  const handleStageCreate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }
  const handleCommitCreate = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && Boolean(input.length)) {
      props.onCreate(input)
      setInput("")
    }
  }

  return (
    <input
      type="text"
      className={cx("new-todo")}
      placeholder="What needs to be done?"
      autoFocus
      value={input}
      onChange={handleStageCreate}
      onKeyDown={handleCommitCreate}
    />
  )
}

const EditTodoInput: React.FC<EditTodoInputProps> = props => {
  const [label, setLabel] = useState(props.value)
  const handleStageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }
  const handleCommitChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      props.onChange(label)
      props.onBlur()
    }
  }
  const handleRevertChange = props.onBlur
  if (!props.show) {
    return null
  }

  return (
    <input
      className={cx("edit")}
      value={label}
      onChange={handleStageChange}
      onBlur={handleRevertChange}
      onKeyDown={handleCommitChange}
      autoFocus
    />
  )
}

const FilterTodos: React.FC<FilterTodosProps> = props => {
  if (!props.show) {
    return null
  }
  return (
    <footer className={cx("footer")}>
      {/* <!-- This should be `0 items left` by default --> */}
      <span className={cx("todo-count")}>
        <strong>{props.activeTodosCount}</strong> item left
      </span>
      {/* <!-- Remove this if you don't implement routing --> */}
      <ul className={cx("filters")}>
        <li>
          <NavLink exact to="/" activeClassName={cx("selected")}>
            All
          </NavLink>
        </li>
        <li>
          <NavLink to="/active" activeClassName={cx("selected")}>
            Active
          </NavLink>
        </li>
        <li>
          <NavLink to="/completed" activeClassName={cx("selected")}>
            Completed
          </NavLink>
        </li>
      </ul>
      {/* <!-- Hidden if no completed items are left ↓ --> */}
      <button
        className={cx("clear-completed")}
        onClick={props.onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  )
}
