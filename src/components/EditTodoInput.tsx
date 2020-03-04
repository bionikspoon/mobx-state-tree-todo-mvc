import React, { useState } from "react"
import { cx } from "../utils/styles"

interface EditTodoInputProps {
  show: boolean
  value: string
  onBlur: () => void
  onChange: (label: string) => void
}
const EditTodoInput: React.FC<EditTodoInputProps> = props => {
  const [label, setLabel] = useState(props.value)
  const handleStageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }
  const handleCommitChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      props.onChange(label)
      props.onBlur()
    }
  }
  if (!props.show) {
    return null
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

export default EditTodoInput
