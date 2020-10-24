import React from 'react'
import LabeledInput from './LabeledInput'

interface Props {
  label: string
  accept: FileExtension[]
  onChange: (file: File|null) => void
  htmlAttrs: React.InputHTMLAttributes<HTMLInputElement>
}

type FileExtension = '.jpg' | '.png'

// eslint-disable-next-line react/display-name
const FileUpload: React.FC<Props> = (props: Props) => {
  return (
    <LabeledInput
      inputType="input"
      label={props.label}
      htmlAttrs={{
        accept: props.accept.join(', '),
        type: 'file',
        onChange: e => {
          props.onChange(e.target.files && e.target.files[0])
        },
        ...props.htmlAttrs
      }}
    />
  )
}

export default FileUpload
