import React from "react"
import { render } from "@testing-library/react"
import App from "./App"
import { TodoStore } from "../models/TodoStore"

describe("<App />", () => {
  const state = {
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
  }
  test("render", () => {
    const { asFragment } = render(<App store={TodoStore.create(state)} />)

    expect(asFragment()).toMatchSnapshot()
  })

  describe("when there are no todos", () => {
    const store = { todos: [] }

    test.each`
      text
      ${"All"}
      ${"Active"}
      ${"Completed"}
    `("should hide the #footer $text link", ({ text }) => {
      const { queryByText } = render(<App store={TodoStore.create(store)} />)

      expect(queryByText(text, { selector: "a" })).not.toBeInTheDocument()
    })

    it("should hide #main", () => {
      const { queryByLabelText } = render(
        <App store={TodoStore.create(store)} />
      )

      expect(queryByLabelText("Mark all as complete")).not.toBeInTheDocument()
    })
  })
})
