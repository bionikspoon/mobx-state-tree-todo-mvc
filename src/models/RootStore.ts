import { types, Instance, cast } from "mobx-state-tree"
import { v4 as uuid } from "uuid"

const Todo = types
  .model("Todo", {
    id: types.optional(types.identifier, () => uuid()),
    label: types.string,
    completed: false,
  })
  .actions(self => ({
    toggle() {
      self.completed = !self.completed
    },
    setLabel(label: string) {
      self.label = label
    },
  }))

export const RootStore = types
  .model("Root", {
    todos: types.optional(types.array(Todo), []),
    editing: "",
  })
  .views(self => ({
    get activeTodos() {
      return self.todos.filter(todo => !todo.completed)
    },
    get completedTodos() {
      return self.todos.filter(todo => todo.completed)
    },
  }))
  .views(self => ({
    get activeTodosCount() {
      return self.activeTodos.length
    },
  }))
  .actions(self => ({
    addTodo(name: string, completed = false) {
      self.todos.push(Todo.create({ label: name, completed: completed }))
    },
    editTodo(id: string) {
      self.editing = id
    },
    removeTodo(id: string) {
      self.todos = cast(self.todos.filter(todo => todo.id !== id))
    },
    clearCompletedTodos() {
      self.todos = cast(self.todos.filter(todo => !todo.completed))
    },
  }))

export type RootInstance = Instance<typeof RootStore>
