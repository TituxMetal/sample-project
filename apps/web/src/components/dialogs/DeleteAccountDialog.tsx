import { useState } from 'react'

import { Button, Input } from '~/components/ui'
import { authClient } from '~/lib/authClient'
import { redirect } from '~/utils/navigation'

interface DeleteAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const DeleteAccountDialog = ({ isOpen, onClose }: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const isConfirmed = confirmText === 'DELETE'

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    const { error } = await authClient.deleteUser()

    if (error) {
      setError(error.message ?? 'Failed to delete account')
      setIsDeleting(false)
      return
    }

    redirect('/')
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70'
      onClick={onClose}
      aria-hidden='true'
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='delete-dialog-title'
        className='w-full max-w-md rounded-lg bg-zinc-800 p-6'
        onClick={e => e.stopPropagation()}
      >
        <h2 id='delete-dialog-title' className='text-xl font-bold text-red-400'>
          Delete Account
        </h2>

        <p className='mt-4 text-zinc-300'>
          This action is <strong>permanent</strong> and cannot be undone. All your data will be
          deleted.
        </p>

        <p className='mt-4 text-zinc-300'>
          Type <strong className='text-red-400'>DELETE</strong> to confirm:
        </p>

        <Input
          type='text'
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder='Type DELETE to confirm'
          className='mt-2'
          fullWidth
        />

        {error && <p className='mt-2 text-red-400'>{error}</p>}

        <footer className='mt-6 flex justify-end gap-3'>
          <Button variant='outline' onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </footer>
      </section>
    </div>
  )
}
