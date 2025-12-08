import { Button } from '~/components/ui'
import type { User } from '~/types/user.types'

export interface ProfileViewProps {
  user: User
  onEdit: () => void
}

export const ProfileView = ({ user, onEdit }: ProfileViewProps) => (
  <>
    <dl className='mx-auto mt-6 grid w-full max-w-lg grid-cols-2 gap-x-8 gap-y-2' role='list'>
      <dt className='font-bold'>Email</dt>
      <dt className='font-bold'>Username</dt>
      <dd>{user.email}</dd>
      <dd>{user.username}</dd>

      <dt className='font-bold'>First name</dt>
      <dt className='font-bold'>Last name</dt>
      <dd>{user.firstName ?? '-'}</dd>
      <dd>{user.lastName ?? '-'}</dd>

      <dt className='col-span-2 font-bold'>Email Verified</dt>
      <dd className='col-span-2'>{user.emailVerified ? 'Yes' : 'No'}</dd>
    </dl>

    <section className='mx-auto mt-4 grid w-full max-w-lg items-center justify-end'>
      <Button onClick={onEdit}>Edit</Button>
    </section>
  </>
)
