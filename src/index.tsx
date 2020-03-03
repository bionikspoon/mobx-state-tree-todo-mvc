import React from "react"
import ReactDOM from "react-dom"

import { TodoStore } from "./models/TodoStore"

import "./index.css"
import App from "./components/App"
import * as serviceWorker from "./serviceWorker"

const store = TodoStore.create()

store.addTodo("Taste JavaScript", true)
store.addTodo("Buy a unicorn")

declare global {
  interface Window {
    store: typeof store
  }
}
window.store = store
console.info("The `TodoStore` has been added to `window.store`.\n", store)

ReactDOM.render(<App store={store} />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
