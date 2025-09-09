import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import { loginSchema } from '~/schemas/auth.schema'
import type { LoginSchema } from '~/schemas/auth.schema'

import { LoginForm } from './LoginForm'

const TestWrapper = ({ defaultValues }: { defaultValues?: Partial<LoginSchema> }) => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      ...defaultValues
    }
  })

  return <LoginForm form={form} />
}

describe('LoginForm', () => {
  it('should render identifier and password fields', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should render fields with correct types', () => {
    render(<TestWrapper />)

    const identifierInput = screen.getByLabelText(/username or email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(identifierInput).toHaveAttribute('type', 'text')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should render fields with correct placeholders', () => {
    render(<TestWrapper />)

    expect(screen.getByPlaceholderText('Enter your username or email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
  })

  it('should render fields with correct autocomplete attributes', () => {
    render(<TestWrapper />)

    const identifierInput = screen.getByLabelText(/username or email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(identifierInput).toHaveAttribute('autocomplete', 'username')
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })

  it('should render fields with default values when provided', () => {
    const defaultValues = {
      identifier: 'test@example.com',
      password: 'testpassword'
    }

    render(<TestWrapper defaultValues={defaultValues} />)

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('testpassword')).toBeInTheDocument()
  })

  it('should display validation errors when form has errors', async () => {
    const TestWrapperWithErrors = () => {
      const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { identifier: '', password: '' }
      })

      // Set errors in useEffect to prevent re-render loop
      useEffect(() => {
        form.setError('identifier', { message: 'Identifier is required' })
        form.setError('password', { message: 'Password is required' })
      }, [form])

      return <LoginForm form={form} />
    }

    render(<TestWrapperWithErrors />)

    expect(screen.getByText('Identifier is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('should register form fields correctly', () => {
    render(<TestWrapper />)

    const identifierInput = screen.getByLabelText(/username or email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(identifierInput).toHaveAttribute('name', 'identifier')
    expect(passwordInput).toHaveAttribute('name', 'password')
  })
})
