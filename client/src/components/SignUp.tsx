import React, { useState }from 'react'
import { Link, useHistory } from 'react-router-dom'
import LabeledInput from './LabeledInput'
import Backend from 'Backend'

interface Props {backend: Backend}
const Signup: React.FC<Props> = ({backend}: Props) => {
  return (
    <div>
        Sign up!
    </div>
  )
}

export default Signup