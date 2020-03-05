import React, { useState } from "react"
import { cx } from "../utils/styles"

interface AddTodoInputProps {
  onCommit: (label: string) => void
}

interface EditTodoInputProps {
  show: boolean
  value: string
  onBlur: () => void
  onCommit: (label: string) => void
}

export const AddTodoInput: React.FC<AddTodoInputProps> = props => {
  const [label, setLabel] = useState("")

  const handleStageCreate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }
  const handleCommitCreate = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return
    }

    if (Boolean(label.length)) {
      props.onCommit(label)
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

export const EditTodoInput: React.FC<EditTodoInputProps> = props => {
  const [label, setLabel] = useState(props.value)

  if (props.show === false) {
    return null
  }

  const handleStageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }
  const handleCommitChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return
    }

    if (Boolean(label.length)) {
      props.onCommit(label)
    } else {
      setLabel(props.value)
    }

    props.onBlur()
  }

  return (
    <input
      className={cx("edit")}
      value={label}
      onChange={handleStageChange}
      onBlur={props.onBlur}
      onKeyDown={handleCommitChange}
      autoFocus
    />
  )
}
