import React from 'react'
import '../styles/labeled-input.scss'

interface BaseProps {
  label: string
  description?: string
  error?: string
  inputType: 'input' | 'textarea'
}

type InputProps = BaseProps & {
  inputType: 'input'
  htmlAttrs: React.InputHTMLAttributes<HTMLInputElement>

}

type TextAreaProps = BaseProps & {
  inputType: 'textarea'
  htmlAttrs: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

type Props = InputProps | TextAreaProps

const LabeledInput: React.FC<Props> = (props: Props) => {
  const id = `labeled-input-${props.label}`

  return (
    <div className='labeled-input'>
      <label htmlFor={id}>
        <span className="labeled-input-label">
          {props.label}
        </span>
        {
          props.description &&
          <span className="labeled-input-desc">
            ({props.description})
          </span>
        }
      </label>
      {
        props.inputType === 'input' ?
          <input id={id} {...props.htmlAttrs} /> :
          <textarea id={id} {...props.htmlAttrs} />
      }
      {props.error && <span className="error">{props.error}</span>}
    </div>
  )
}

export default LabeledInput
