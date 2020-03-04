import { TodoStore, TodoStoreInstance } from "./models/TodoStore"

export const store = TodoStore.create({
  todos: [
    {
      label: "Taste JavaScript",
      completed: true,
    },
    {
      label: "Buy a unicorn",
      completed: false,
    },
  ],
})

declare global {
  interface Window {
    store: TodoStoreInstance
  }
}
window.store = store

console.info("The `TodoStore` has been added to `window.store`.\n", store)
