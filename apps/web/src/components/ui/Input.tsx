import type { InputHTMLAttributes } from 'react'
import React, { useId } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', fullWidth = false, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || `input-${generatedId}`

    const baseInputClasses =
      'w-full rounded-lg border-2 bg-zinc-900 px-3 py-2 text-zinc-300 focus:outline-none'
    const errorInputClasses = 'border-red-400 focus:border-red-400'
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className='flex font-medium text-zinc-300'>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${widthClass} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className='mt-2 font-semibold text-red-400'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
