import React from "react"
import { cx } from "../utils/styles"

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => (
  <footer className={cx("info")}>
    <p>Double-click to edit a todo</p>
    <p>
      Created by <a href="https://manuphatak.com">Manu Phatak</a>
    </p>
    <p>
      Part of <a href="http://todomvc.com">TodoMVC</a>
    </p>
  </footer>
)

export default Footer
