import { types, Instance } from "mobx-state-tree"
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
  }))

export const RootStore = types
  .model("Root", {
    todos: types.optional(types.array(Todo), []),
    editing: "",
  })
  .actions(self => ({
    addTodo(name: string, completed = false) {
      self.todos.push(Todo.create({ label: name, completed: completed }))
    },
    editTodo(id: string) {
      self.editing = id
    },
    removeTodo(id: string) {
      const index = self.todos.findIndex(todo => todo.id === id)
      self.todos.splice(index, 1)
    },
  }))

export type RootInstance = Instance<typeof RootStore>
