import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '~/components/ui'
import { FormWrapper } from '~/components/ui/FormWrapper'
import type { User } from '~/types'

import { updateProfile } from '../api/user.service'
import type { UpdateProfileSchema } from '../schemas/user.schema'
import { updateProfileSchema } from '../schemas/user.schema'

import { EditProfileForm } from './EditProfileForm'
import { ProfileView } from './ProfileView'

export interface EditProfileContainerProps {
  userData: User
}

export const EditProfileContainer = ({ userData }: EditProfileContainerProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User>(userData)

  const form = useForm<UpdateProfileSchema>({
    defaultValues: {
      username: userData.username,
      firstName: userData.firstName || '',
      lastName: userData.lastName || ''
    },
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: zodResolver(updateProfileSchema)
  })

  const onCancel = () => {
    setIsEditing(false)
    setServerError(null)
    form.reset({
      username: currentUser.username,
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || ''
    })
  }

  const handleSubmit = form.handleSubmit(async (values: UpdateProfileSchema) => {
    setServerError(null)

    try {
      const updatedUser = await updateProfile(values)
      setCurrentUser(updatedUser)
      setIsEditing(false)

      form.reset({
        username: updatedUser.username,
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || ''
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Update failed')
    }
  })

  if (!isEditing) {
    return <ProfileView user={currentUser} onEdit={() => setIsEditing(true)} />
  }

  const isFormError = form.formState.isSubmitted && !form.formState.isValid

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      error={serverError}
      className='mx-auto mt-6 grid w-full max-w-lg gap-4'
    >
      <EditProfileForm form={form} />

      <section className='flex items-center justify-between'>
        <Button variant='destructive' type='button' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isFormError}>
          Submit
        </Button>
      </section>
    </FormWrapper>
  )
}
