import React from 'react'
import './WaitPanel.scss'

interface WaitPanelProps {
  msg: string
}

const WaitPanel: React.FC<WaitPanelProps> = ({ msg }) => {
  return (
    <div className="wait-panel panel">
      <h1 className="wait-panel__msg">{msg}</h1>
    </div>
  )
}

export default WaitPanel
