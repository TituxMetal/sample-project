import { zodResolver } from '@hookform/resolvers/zod'
import { beforeEach, describe, expect, it } from 'bun:test'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { updateProfileSchema } from '~/schemas/user.schema'
import type { UpdateProfileSchema } from '~/schemas/user.schema'
import { cleanup, render, screen } from '~/test-utils'

import { EditProfileForm } from './EditProfileForm'

const TestWrapper = ({ defaultValues }: { defaultValues?: Partial<UpdateProfileSchema> }) => {
  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      ...defaultValues
    }
  })

  return <EditProfileForm form={form} />
}

describe('EditProfileForm', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render username, firstName, and lastName fields', () => {
    render(<TestWrapper />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
  })

  it('should render fields with correct types', () => {
    render(<TestWrapper />)

    const usernameInput = screen.getByLabelText(/username/i)
    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)

    expect(usernameInput).toHaveAttribute('type', 'text')
    expect(firstNameInput).toHaveAttribute('type', 'text')
    expect(lastNameInput).toHaveAttribute('type', 'text')
  })

  it('should render fields with default values when provided', () => {
    const defaultValues = {
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe'
    }

    render(<TestWrapper defaultValues={defaultValues} />)

    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
  })

  it('should display validation errors when form has errors', async () => {
    const TestWrapperWithErrors = () => {
      const form = useForm<UpdateProfileSchema>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: { username: '', firstName: '', lastName: '' }
      })

      // Set errors in useEffect to prevent re-render loop
      useEffect(() => {
        form.setError('username', { message: 'Username is required' })
        form.setError('firstName', { message: 'First name is required' })
        form.setError('lastName', { message: 'Last name is required' })
      }, [form])

      return <EditProfileForm form={form} />
    }

    render(<TestWrapperWithErrors />)

    expect(screen.getByText('Username is required')).toBeInTheDocument()
    expect(screen.getByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Last name is required')).toBeInTheDocument()
  })

  it('should register form fields correctly', () => {
    render(<TestWrapper />)

    const usernameInput = screen.getByLabelText(/username/i)
    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)

    expect(usernameInput).toHaveAttribute('name', 'username')
    expect(firstNameInput).toHaveAttribute('name', 'firstName')
    expect(lastNameInput).toHaveAttribute('name', 'lastName')
  })

  it('should not have any buttons or form submission elements', () => {
    render(<TestWrapper />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should only render form fields and nothing else', () => {
    render(<TestWrapper />)

    // Should only have 3 inputs and their labels
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(3)

    const labels = screen.getAllByText(/name|username/i)
    expect(labels).toHaveLength(3)
  })
})
