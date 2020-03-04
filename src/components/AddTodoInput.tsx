import React, { useState } from "react"
import { cx } from "../utils/styles"

interface AddTodoInputProps {
  onCreate: (label: string) => void
}

const AddTodoInput: React.FC<AddTodoInputProps> = props => {
  const [label, setLabel] = useState("")

  const handleStageCreate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }
  const handleCommitCreate = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && Boolean(label.length)) {
      props.onCreate(label)
      setLabel("")
    }
  }

  return (
    <input
      type="text"
      className={cx("new-todo")}
      placeholder="What needs to be done?"
      autoFocus
      value={label}
      onChange={handleStageCreate}
      onKeyDown={handleCommitCreate}
    />
  )
}

export default AddTodoInput
