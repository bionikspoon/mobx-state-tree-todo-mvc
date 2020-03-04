import React from "react"
import { NavLink } from "react-router-dom"
import { observer } from "mobx-react"

import { cx } from "../utils/styles"
import { TodoStoreInstance } from "../models/TodoStore"

interface FilterTodosProps {
  store: TodoStoreInstance
}

/* <!-- This footer should hidden by default and shown when there are todos --> */
const FilterTodos: React.FC<FilterTodosProps> = props => {
  if (!props.store.todos.length) {
    return null
  }

  return (
    <footer className={cx("footer")}>
      {/* <!-- This should be `0 items left` by default --> */}
      <span className={cx("todo-count")}>
        <strong>{props.store.activeTodosCount}</strong> item left
      </span>
      {/* <!-- Remove this if you don't implement routing --> */}
      <ul className={cx("filters")}>
        <li>
          <NavLink exact to="/" activeClassName={cx("selected")}>
            All
          </NavLink>
        </li>
        <li>
          <NavLink to="/active" activeClassName={cx("selected")}>
            Active
          </NavLink>
        </li>
        <li>
          <NavLink to="/completed" activeClassName={cx("selected")}>
            Completed
          </NavLink>
        </li>
      </ul>
      {/* <!-- Hidden if no completed items are left ↓ --> */}
      <button
        className={cx("clear-completed")}
        onClick={props.store.clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  )
}

export default observer(FilterTodos)
