import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { cleanup, render, screen } from '~/test-utils'

import type { LoginSchema } from '../schemas/auth.schema'
import { loginSchema } from '../schemas/auth.schema'

import { LoginForm } from './LoginForm'

const TestWrapper = ({ defaultValues }: { defaultValues?: Partial<LoginSchema> }) => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      ...defaultValues
    }
  })

  return <LoginForm form={form} />
}

describe('LoginForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render email and password fields', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should render fields with correct types', () => {
    render(<TestWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should render fields with correct placeholders', () => {
    render(<TestWrapper />)

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
  })

  it('should render fields with correct autocomplete attributes', () => {
    render(<TestWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('autocomplete', 'email')
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })

  it('should render fields with default values when provided', () => {
    const defaultValues = {
      email: 'test@example.com',
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
        defaultValues: { email: '', password: '' }
      })

      // Set errors in useEffect to prevent re-render loop
      useEffect(() => {
        form.setError('email', { message: 'Email is required' })
        form.setError('password', { message: 'Password is required' })
      }, [form])

      return <LoginForm form={form} />
    }

    render(<TestWrapperWithErrors />)

    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('should register form fields correctly', () => {
    render(<TestWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('name', 'email')
    expect(passwordInput).toHaveAttribute('name', 'password')
  })
})
