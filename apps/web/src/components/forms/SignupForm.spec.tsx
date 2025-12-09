import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type { SignupSchema } from '~/schemas/auth.schema'
import { signupSchema } from '~/schemas/auth.schema'
import { cleanup, render, screen } from '~/test-utils'

import { SignupForm } from './SignupForm'

const TestWrapper = ({ defaultValues }: { defaultValues?: Partial<SignupSchema> }) => {
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      // name: '',
      username: '',
      email: '',
      password: '',
      ...defaultValues
    }
  })

  return <SignupForm form={form} />
}

describe('SignupForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render username, email, and password fields', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should render fields with correct types', () => {
    render(<TestWrapper />)

    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(usernameInput).toHaveAttribute('type', 'text')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should render fields with correct placeholders', () => {
    render(<TestWrapper />)

    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
  })

  it('should render fields with correct autocomplete attributes', () => {
    render(<TestWrapper />)

    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(usernameInput).toHaveAttribute('autocomplete', 'username')
    expect(emailInput).toHaveAttribute('autocomplete', 'email')
    expect(passwordInput).toHaveAttribute('autocomplete', 'new-password')
  })

  it('should render fields with default values when provided', () => {
    const defaultValues = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword'
    }

    render(<TestWrapper defaultValues={defaultValues} />)

    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('testpassword')).toBeInTheDocument()
  })

  it('should display validation errors when form has errors', async () => {
    const TestWrapperWithErrors = () => {
      const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: { username: '', email: '', password: '' }
      })

      // Set errors in useEffect to prevent re-render loop
      useEffect(() => {
        form.setError('username', { message: 'Username is required' })
        form.setError('email', { message: 'Invalid email address' })
        form.setError('password', { message: 'Password is required' })
      }, [form])

      return <SignupForm form={form} />
    }

    render(<TestWrapperWithErrors />)

    expect(screen.getByText('Username is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('should register form fields correctly', () => {
    render(<TestWrapper />)

    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    // expect(nameInput).toHaveAttribute('name', 'name')
    expect(usernameInput).toHaveAttribute('name', 'username')
    expect(emailInput).toHaveAttribute('name', 'email')
    expect(passwordInput).toHaveAttribute('name', 'password')
  })
})
