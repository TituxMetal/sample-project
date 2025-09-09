import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '~/components/ui'
import { FormWrapper } from '~/components/ui/FormWrapper'
import { EditProfileForm } from '~/components/forms/EditProfileForm'
import { ProfileView } from '~/components/ProfileView'
import { updateProfileSchema, type UpdateProfileSchema } from '~/schemas/user.schema'
import { updateProfile } from '~/services/user.service'
import type { User } from '~/types/user.types'

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

    const result = await updateProfile(values)

    if (!result.success || !result.data) {
      setServerError(result.message || 'Update failed')
      return
    }

    setCurrentUser(result.data)
    setIsEditing(false)

    form.reset({
      username: result.data.username,
      firstName: result.data.firstName || '',
      lastName: result.data.lastName || ''
    })
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
