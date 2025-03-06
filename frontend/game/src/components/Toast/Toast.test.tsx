import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Toast from './Toast'

describe('<Toast/>', () => {
  it('displays message', () => {
    // Arrange
    const msgs = ['Test Message']

    // Act
    render(<Toast msgs={msgs} />)

    // Assert
    expect(screen.getByText(msgs[0])).toBeInTheDocument()
  })
})
