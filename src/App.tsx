import React, { ReactElement } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { RootStore } from "./models/RootStore"
import TodoApp from "./TodoApp"
const store = RootStore.create()

store.addTodo("Taste JavaScript", true)
store.addTodo("Buy a unicorn")

declare global {
  interface Window {
    store: typeof store
  }
}
window.store = store

interface Props {}

export default function App(_props: Props): ReactElement {
  return (
    <Router>
      <Switch>
        <Route path={"/:view?"}>
          <TodoApp store={store} />
        </Route>
      </Switch>
    </Router>
  )
}
