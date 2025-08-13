import type { UserResponseDto } from '@packages/types'
import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { Welcome } from '~ui/Welcome'

describe('Welcome component', () => {
  const title = 'Test Title'
  const pageDescription = 'Test Description'
  const user = {
    id: '1',
    email: 'test@test.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as UserResponseDto
  const children = <p>Some child content</p>

  it('should render all elements when all props are provided', () => {
    render(
      <Welcome title={title} pageDescription={pageDescription} user={user}>
        {children}
      </Welcome>
    )

    const preElement = screen.getByText(
      (_content, element) => element?.tagName.toLowerCase() === 'pre'
    )
    const renderedUser = JSON.parse(preElement.textContent || '{}')

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByText(pageDescription)).toBeInTheDocument()
    expect(screen.getByText('Some child content')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'User Data' })).toBeInTheDocument()
    expect(renderedUser).toEqual(user)
  })

  it('should render with a child element', () => {
    render(
      <Welcome title='Test Title'>
        <p>Some child content</p>
      </Welcome>
    )

    expect(screen.getByText('Some child content')).toBeInTheDocument()
  })

  it('should not render optional sections when props are not provided', () => {
    render(<Welcome title='Test Title' />)

    expect(screen.queryByText('Test Title')).toBeInTheDocument()
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
    expect(screen.queryByText('Some child content')).not.toBeInTheDocument()
  })
})
