import React from "react"
import { render, RenderResult, fireEvent, within } from "@testing-library/react"
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
  test("should render", () => {
    const { container } = render(<App store={TodoStore.create(state)} />)

    expect(container).toMatchSnapshot()
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

  describe("when the page is loaded", () => {
    const store = { todos: [] }

    test("should autofocus the new todo input", () => {
      const { getByPlaceholderText } = render(
        <App store={TodoStore.create(store)} />
      )

      expect(getByPlaceholderText("What needs to be done?")).toHaveFocus()
    })
  })

  describe("when creating a new todo", () => {
    function createTodo(wrapper: RenderResult, value: string) {
      const newTodoInput = wrapper.getByPlaceholderText(
        "What needs to be done?"
      )

      fireEvent.change(newTodoInput, {
        target: { value },
      })

      fireEvent.keyDown(newTodoInput, { key: "Enter" })

      return { newTodoInput }
    }

    const store = {
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

    test("should match diff snapshot", () => {
      const wrapper = render(<App store={TodoStore.create(store)} />)
      const clone = wrapper.container.cloneNode(true)
      createTodo(wrapper, "Create a TODO for testing")

      expect(clone).toMatchDiffSnapshot(wrapper.container)
    })

    test("should append the todo to the list", () => {
      const wrapper = render(<App store={TodoStore.create(store)} />)
      createTodo(wrapper, "Create a TODO for testing")

      const todos = wrapper.getAllByTestId("todo-item")
      const lastTodo = todos[todos.length - 1]

      expect(lastTodo).toHaveTextContent("Create a TODO for testing")
    })

    test("should clear the input", () => {
      const wrapper = render(<App store={TodoStore.create(store)} />)
      const { newTodoInput } = createTodo(wrapper, "Create a TODO for testing")

      expect(newTodoInput).toHaveValue("")
    })

    test("should trim white space of the input", () => {
      const wrapper = render(<App store={TodoStore.create(store)} />)
      createTodo(wrapper, "          Create a TODO for testing          ")
      const todos = wrapper.getAllByTestId("todo-item")
      const lastTodo = todos[todos.length - 1]

      expect(lastTodo.textContent).toEqual("Create a TODO for testing")
    })

    test("should not create an empty todo", () => {
      const wrapper = render(<App store={TodoStore.create(store)} />)
      createTodo(wrapper, "         ")

      const todos = wrapper.getAllByTestId("todo-item")
      const lastTodo = todos[todos.length - 1]

      expect(lastTodo).toHaveTextContent("Buy a unicorn")
    })
  })
})
