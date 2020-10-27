import React from 'react'
import {AiOutlineClose} from 'react-icons/ai'
import '../styles/dialog.scss'

interface Props {
  onClose: () => void
}

const Dialog: React.FC<React.PropsWithChildren<Props>> = (
  {children, ...props}: React.PropsWithChildren<Props>,
) => {
  return (
    <>
      <div className="dialog-backdrop"></div>
      <dialog className="dialog" open>
        <button className="dialog-close-btn" onClick={props.onClose}>
          <AiOutlineClose />
        </button>
        <div className="dialog-content">
          {children}
        </div>
      </dialog>
    </>
  )
}

export default Dialog
