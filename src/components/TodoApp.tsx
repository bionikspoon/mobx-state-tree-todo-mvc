import React, { useState } from "react"
import { observer } from "mobx-react"
import { useParams } from "react-router-dom"

import { TodoStoreInstance } from "../models/TodoStore"
import { cx } from "../utils/styles"

import FilterTodos from "./FilterTodos"

interface TodoAppProps {
  store: TodoStoreInstance
}

interface AddTodoInputProps {
  onCreate: (label: string) => void
}

interface EditTodoInputProps {
  show: boolean
  value: string
  onBlur: () => void
  onRemove: () => void
  onChange: (label: string) => void
}

const TodoApp: React.FC<TodoAppProps> = observer(props => {
  const todos = useFilteredTodos(props.store)

  return (
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
            checked={props.store.allCompleted}
            onChange={props.store.toggleAll}
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
                      onChange={() => todo.toggle()}
                    />
                    <label onDoubleClick={() => props.store.editTodo(todo.id)}>
                      {todo.label}
                    </label>
                    <button
                      className={cx("destroy")}
                      onClick={() => todo.remove()}
                    ></button>
                  </div>

                  <EditTodoInput
                    show={editing}
                    value={todo.label}
                    onBlur={handleEditInputBlur}
                    onChange={handleEditInputChange}
                    onRemove={todo.remove}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <FilterTodos store={props.store}></FilterTodos>
    </section>
  )
})

export default TodoApp

function useFilteredTodos(store: TodoStoreInstance) {
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
  const [label, setLabel] = useState("")

  const handleStageCreate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }
  const handleCommitCreate = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && Boolean(label.length)) {
      props.onCreate(label)
      setLabel("")
    }
  }

  return (
    <input
      type="text"
      className={cx("new-todo")}
      placeholder="What needs to be done?"
      autoFocus
      value={label}
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
      if (Boolean(label.length)) {
        props.onChange(label)
      } else {
        props.onRemove()
      }
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
