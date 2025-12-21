import { useState } from 'react'

import { Button } from '~/components/ui'

import { DeleteAccountDialog } from './DeleteAccountDialog'

export const DeleteAccountSection = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className='rounded-lg border-2 border-red-900 bg-zinc-800 p-6'>
      <h2 className='text-lg font-bold text-red-400'>Danger Zone</h2>
      <p className='mt-2 text-zinc-300'>Once you delete your account, there is no going back.</p>
      <Button variant='destructive' onClick={() => setIsOpen(true)} className='mt-4'>
        Delete Account
      </Button>
      <DeleteAccountDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  )
}
