import type { UseFormReturn } from 'react-hook-form'

import { Input } from '~/components/ui'
import type { UpdateProfileSchema } from '~/schemas/user.schema'

export interface EditProfileFormProps {
  form: UseFormReturn<UpdateProfileSchema>
}

export const EditProfileForm = ({ form }: EditProfileFormProps) => (
  <>
    <Input
      {...form.register('username')}
      label='Username'
      error={form.formState.errors.username?.message}
    />

    <Input
      {...form.register('firstName')}
      label='First name'
      error={form.formState.errors.firstName?.message}
    />

    <Input
      {...form.register('lastName')}
      label='Last name'
      error={form.formState.errors.lastName?.message}
    />
  </>
)
