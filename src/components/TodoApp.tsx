import React, { useState } from "react"
import { observer } from "mobx-react"
import { useParams } from "react-router-dom"

import { TodoStoreInstance, TodoInstance } from "../models/TodoStore"
import { cx } from "../utils/styles"

import FilterTodos from "./FilterTodos"
import { AddTodoInput } from "./Input"
import TodoItem from "./TodoItem"

interface TodoAppProps {
  store: TodoStoreInstance
}

const TodoApp: React.FC<TodoAppProps> = props => {
  const todos = useFilteredTodos(props.store)

  const [
    currentlyEditingTodo,
    setCurrentlyEditingTodo,
  ] = useState<TodoInstance | null>(null)
  const resetCurrentlyEditingTodo = () => setCurrentlyEditingTodo(null)

  return (
    <section className={cx("todoapp")}>
      <header className={cx("header")}>
        <h1>todos</h1>
        <AddTodoInput onCommit={props.store.addTodo}></AddTodoInput>
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
          <ul className={cx("todo-list")} data-testid="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                isEditing={todo === currentlyEditingTodo}
                todo={todo}
                onOpenEditor={setCurrentlyEditingTodo}
                onCloseEditor={resetCurrentlyEditingTodo}
              />
            ))}
          </ul>
        </section>
      )}

      <FilterTodos store={props.store}></FilterTodos>
    </section>
  )
}

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

export default observer(TodoApp)
