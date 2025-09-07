import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateProfileSchema, type UpdateProfileSchema } from '~/schemas/user.schema'
import { updateProfile } from '~/services/user.service'
import type { User } from '~/types/user.types'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export const EditProfileForm = ({ userData }: { userData: User }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User>(userData)

  const form = useForm<UpdateProfileSchema>({
    defaultValues: {
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName
    },
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: zodResolver(updateProfileSchema)
  })

  const onCancel = () => {
    setIsEditing(false)
    form.reset({
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName
    })
  }

  const onSubmit = form.handleSubmit(async (values: UpdateProfileSchema) => {
    setServerError(null)

    const result = await updateProfile(values)

    if (!result.success || !result.data) {
      setServerError(result.message || 'Update failed')
      return
    }

    setCurrentUser(result.data)
    setIsEditing(false)

    form.reset({
      username: result.data.username,
      firstName: result.data.firstName,
      lastName: result.data.lastName
    })
  })

  return (
    <>
      {isEditing ? (
        <form className='mx-auto mt-6 grid w-full max-w-lg gap-4' role='form' onSubmit={onSubmit}>
          {serverError && (
            <p className='rounded-md bg-red-800/80 p-3 font-bold text-red-300' role='alert'>
              {serverError}
            </p>
          )}
          <Input
            label='Username'
            {...form.register('username')}
            error={form.formState.errors.username?.message}
          />
          <Input
            label='First name'
            {...form.register('firstName')}
            error={form.formState.errors.firstName?.message}
          />
          <Input
            label='Last name'
            {...form.register('lastName')}
            error={form.formState.errors.lastName?.message}
          />
          <section className='flex items-center justify-between'>
            <Button variant='destructive' onClick={onCancel}>
              Cancel
            </Button>
            <Button type='submit' disabled={!form.formState.isValid}>
              Submit
            </Button>
          </section>
        </form>
      ) : (
        <>
          <dl className='mx-auto mt-6 grid w-full max-w-lg grid-cols-2 gap-x-8 gap-y-2'>
            <dt className='font-bold'>Email</dt>
            <dt className='font-bold'>Username</dt>
            <dd>{currentUser.email}</dd>
            <dd>{currentUser.username}</dd>

            <dt className='font-bold'>First name</dt>
            <dt className='font-bold'>Last name</dt>
            <dd>{currentUser.firstName ?? '-'}</dd>
            <dd>{currentUser.lastName ?? '-'}</dd>

            <dt className='col-span-2 font-bold'>Confirmed</dt>
            <dd className='col-span-2'>{currentUser.confirmed ? 'Yes' : 'No'}</dd>
          </dl>
          <section className='mx-auto mt-4 grid w-full max-w-lg items-center justify-end'>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </section>
        </>
      )}
    </>
  )
}
