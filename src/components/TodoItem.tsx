import React from "react"
import { observer } from "mobx-react"

import { TodoInstance } from "../models/TodoStore"
import { cx } from "../utils/styles"

import { EditTodoInput } from "./Input"

interface TodoItemProps {
  todo: TodoInstance
  isEditing: boolean
  onOpenEditor: (todo: TodoInstance) => void
  onCloseEditor: () => void
}

// List items should get the class `editing` when editing and `completed` when marked as completed
const TodoItem: React.FC<TodoItemProps> = props => (
  <li
    data-testid="todo-item"
    className={cx({
      completed: props.todo.completed,
      editing: props.isEditing,
    })}
  >
    <div className={cx("view")}>
      <input
        className={cx("toggle")}
        type="checkbox"
        checked={props.todo.completed}
        onChange={() => props.todo.toggle(undefined)}
        id={`todo-item-${props.todo.id}`}
      />
      <label
        htmlFor={`todo-item-${props.todo.id}`}
        onDoubleClick={() => props.onOpenEditor(props.todo)}
      >
        {props.todo.label}
      </label>
      <button className={cx("destroy")} onClick={props.todo.remove}></button>
    </div>

    <EditTodoInput
      show={props.isEditing}
      value={props.todo.label}
      onBlur={props.onCloseEditor}
      onCommit={props.todo.setLabel}
    />
  </li>
)

export default observer(TodoItem)
