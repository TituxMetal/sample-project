import type { LabelHTMLAttributes } from 'react'
import React from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className = '', required = false, ...props }, ref) => {
    const baseClasses = 'flex font-medium text-zinc-300'
    const combinedClasses = `${baseClasses} ${className}`

    return (
      <label ref={ref} className={combinedClasses} {...props}>
        {children}
        {required && <span className='ml-1 text-red-400'>*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'
