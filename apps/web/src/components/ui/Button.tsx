import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType } from 'react'
import React from 'react'

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive'

type ButtonBaseProps = {
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
  disabled?: boolean
  as?: ElementType
}

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonAsAnchor = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement>

export type ButtonProps = ButtonAsButton | (ButtonAsAnchor & { as: 'a' })

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', children, className = '', disabled, as, ...rest }, ref) => {
    const baseClasses =
      'w-fit rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-70 transition-colors'
    const variantClasses = {
      default: 'bg-sky-400 text-zinc-900 hover:bg-sky-400/85 border-2 border-transparent',
      outline: 'bg-transparent border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800',
      ghost:
        'bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200 border-2 border-transparent',
      destructive: 'bg-red-900 text-red-300 hover:bg-red-900/85 border-2 border-transparent'
    }

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed' : as ? '' : 'cursor-pointer'} ${className}`
    const Component = as || 'button'

    return (
      <Component ref={ref} className={combinedClasses} disabled={disabled} {...rest}>
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'
