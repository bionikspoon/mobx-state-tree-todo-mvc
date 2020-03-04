import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import { TodoStoreInstance } from "../models/TodoStore"
import TodoApp from "./TodoApp"
import Footer from "./Footer"

interface AppProps {
  store: TodoStoreInstance
}

const App: React.FC<AppProps> = props => (
  <>
    <Router>
      <Route path="/:view?">
        <TodoApp store={props.store} />
      </Route>
    </Router>
    <Footer />
  </>
)

export default App
