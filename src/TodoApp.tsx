import React, { useState } from "react"
import styles from "./styles.module.scss"
import classnames from "classnames/bind"
import { RootInstance } from "./models/RootStore"
import { observer } from "mobx-react"

const cx = classnames.bind(styles)

interface Props {
  store: RootInstance
}

const TodoApp: React.FC<Props> = observer(props => {
  const store = props.store

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
                store.addTodo(input)
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
        {Boolean(store.todos.length) && (
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
              {store.todos.map(todo => {
                const editing = todo.id === store.editing
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
                      <label onDoubleClick={() => store.editTodo(todo.id)}>
                        {todo.label}
                      </label>
                      <button
                        className={cx("destroy")}
                        onClick={() => store.removeTodo(todo.id)}
                      ></button>
                    </div>
                    <input
                      ref={node => {
                        if (editing && node) {
                          node.focus()
                        }
                      }}
                      className={cx("edit")}
                      value={todo.label}
                      onChange={() => {}}
                      onBlur={() => store.editTodo("")}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        )}
        {/* <!-- This footer should hidden by default and shown when there are todos --> */}
        {Boolean(store.todos.length) && (
          <footer className={cx("footer")}>
            {/* <!-- This should be `0 items left` by default --> */}
            <span className={cx("todo-count")}>
              <strong>0</strong> item left
            </span>
            {/* <!-- Remove this if you don't implement routing --> */}
            <ul className={cx("filters")}>
              <li>
                <a className={cx("selected")} href="#/">
                  All
                </a>
              </li>
              <li>
                <a href="#/active">Active</a>
              </li>
              <li>
                <a href="#/completed">Completed</a>
              </li>
            </ul>
            {/* <!-- Hidden if no completed items are left ↓ --> */}
            <button className={cx("clear-completed")}>Clear completed</button>
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
