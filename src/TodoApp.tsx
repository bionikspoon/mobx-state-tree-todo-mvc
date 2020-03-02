import React, { useState } from "react"
import classnames from "classnames/bind"
import { observer } from "mobx-react"
import { useParams } from "react-router-dom"
import { NavLink } from "react-router-dom"

import styles from "./styles.module.scss"
import { RootInstance } from "./models/RootStore"

const cx = classnames.bind(styles)

interface Props {
  store: RootInstance
}

const TodoApp: React.FC<Props> = observer(props => {
  const { view } = useParams()
  const todos = (() => {
    switch (view) {
      case "active":
        return props.store.activeTodos
      case "completed":
        return props.store.completedTodos
      default:
        return props.store.todos
    }
  })()

  return (
    <>
      <section className={cx("todoapp")}>
        <header className={cx("header")}>
          <h1>todos</h1>
          {(() => {
            const [input, setInput] = useState("")

            const handleChange = (
              event: React.ChangeEvent<HTMLInputElement>
            ) => {
              setInput(event.target.value)
            }
            const handleKeyDown = (
              event: React.KeyboardEvent<HTMLInputElement>
            ) => {
              if (event.key === "Enter") {
                props.store.addTodo(input)
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
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            )
          })()}
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
                    {editing && (
                      <EditTodoInput
                        value={todo.label}
                        onBlur={handleEditInputBlur}
                        onChange={handleEditInputChange}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}
        {/* <!-- This footer should hidden by default and shown when there are todos --> */}
        {Boolean(props.store.todos.length) && (
          <footer className={cx("footer")}>
            {/* <!-- This should be `0 items left` by default --> */}
            <span className={cx("todo-count")}>
              <strong>{props.store.activeTodosCount}</strong> item left
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
              onClick={props.store.removeCompleteTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
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

interface EditTodoInputProps {
  value: string
  onBlur: () => void
  onChange: (label: string) => void
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
