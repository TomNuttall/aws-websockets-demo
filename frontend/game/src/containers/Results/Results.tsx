import React from 'react'

interface ResultsProps {
  names: string[]
}

const Results: React.FC<ResultsProps> = ({ names }) => {
  return (
    <ul>
      {names.map((name: string) => {
        return <li key={name}>{name}</li>
      })}
    </ul>
  )
}

export default Results
