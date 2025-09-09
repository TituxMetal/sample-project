import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FormWrapper } from './FormWrapper'

describe('FormWrapper', () => {
  it('should render children correctly', () => {
    const handleSubmit = vi.fn()

    render(
      <FormWrapper onSubmit={handleSubmit}>
        <input data-testid='test-input' />
        <button type='submit'>Submit</button>
      </FormWrapper>
    )

    expect(screen.getByTestId('test-input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('should call onSubmit when form is submitted', () => {
    const handleSubmit = vi.fn(e => e.preventDefault())

    render(
      <FormWrapper onSubmit={handleSubmit}>
        <button type='submit'>Submit</button>
      </FormWrapper>
    )

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('should display error message when error prop is provided', () => {
    const handleSubmit = vi.fn()
    const errorMessage = 'Something went wrong'

    render(
      <FormWrapper onSubmit={handleSubmit} error={errorMessage}>
        <input />
      </FormWrapper>
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass(
      'rounded-md bg-red-800/80 p-3 font-bold text-red-300'
    )
  })

  it('should not display error message when error is null', () => {
    const handleSubmit = vi.fn()

    render(
      <FormWrapper onSubmit={handleSubmit} error={null}>
        <input />
      </FormWrapper>
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should not display error message when error is not provided', () => {
    const handleSubmit = vi.fn()

    render(
      <FormWrapper onSubmit={handleSubmit}>
        <input />
      </FormWrapper>
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should apply custom className when provided', () => {
    const handleSubmit = vi.fn()
    const customClass = 'custom-form-class'

    render(
      <FormWrapper onSubmit={handleSubmit} className={customClass}>
        <input />
      </FormWrapper>
    )

    const form = screen.getByRole('form')
    expect(form).toHaveClass(customClass)
  })

  it('should apply default className when no className provided', () => {
    const handleSubmit = vi.fn()

    render(
      <FormWrapper onSubmit={handleSubmit}>
        <input />
      </FormWrapper>
    )

    expect(screen.getByRole('form')).toHaveClass('mx-auto mt-6 grid w-full max-w-md gap-4')
  })

  it('should be accessible with proper form role', () => {
    const handleSubmit = vi.fn()

    render(
      <FormWrapper onSubmit={handleSubmit}>
        <input />
      </FormWrapper>
    )

    expect(screen.getByRole('form')).toBeInTheDocument()
  })
})
