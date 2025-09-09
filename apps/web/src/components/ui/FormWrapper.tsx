import type { FormEvent, ReactNode } from 'react'

export interface FormWrapperProps {
  children: ReactNode
  onSubmit: (e: FormEvent) => void
  error?: string | null
  isLoading?: boolean
  className?: string
}

export const FormWrapper = ({
  children,
  onSubmit,
  error,
  className = 'mx-auto mt-6 grid w-full max-w-md gap-4'
}: FormWrapperProps) => (
  <form onSubmit={onSubmit} className={className} role='form'>
    {error && (
      <p className='rounded-md bg-red-800/80 p-3 font-bold text-red-300' role='alert'>
        {error}
      </p>
    )}

    {children}
  </form>
)
