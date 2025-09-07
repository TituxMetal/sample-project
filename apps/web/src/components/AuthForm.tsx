import { useAuthForm } from '~/hooks/useAuthForm'
import { authenticateUser } from '~/services/auth.service'
import type {
  ComponentAuthFormProps,
  FormComponentProps,
  FormWrapperProps
} from '~/types/auth.types'
import { routes } from '~/utils/routes'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

const FormWrapper = ({ serverError, isError, handleSubmit, mode, children }: FormWrapperProps) => (
  <form onSubmit={handleSubmit} className='mx-auto mt-6 grid w-full max-w-md gap-4'>
    {serverError && (
      <p className='rounded-md bg-red-800/80 p-3 font-bold text-red-300' role='alert'>
        {serverError}
      </p>
    )}

    {children}

    <div className='flex items-center justify-between'>
      <Button type='submit' disabled={isError}>
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      <a
        href={routes.auth.getOppositeModeUrl(mode)}
        className='font-semibold text-amber-200 hover:text-amber-300'
      >
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
      </a>
    </div>
  </form>
)

const LoginForm = ({ onAuthenticate, redirectPath }: FormComponentProps) => {
  const { form, serverError, isError, handleSubmit } = useAuthForm(
    'login',
    onAuthenticate,
    redirectPath
  )

  return (
    <FormWrapper
      serverError={serverError}
      isError={isError}
      handleSubmit={handleSubmit}
      mode='login'
    >
      <Input
        {...form.register('identifier')}
        label='Username or Email'
        placeholder='Enter your username or email'
        error={form.formState.errors.identifier?.message}
        autoComplete='username'
      />

      <Input
        {...form.register('password')}
        type='password'
        label='Password'
        placeholder='Enter your password'
        error={form.formState.errors.password?.message}
        autoComplete='current-password'
      />
    </FormWrapper>
  )
}

const SignupForm = ({ onAuthenticate, redirectPath }: FormComponentProps) => {
  const { form, serverError, isError, handleSubmit } = useAuthForm(
    'signup',
    onAuthenticate,
    redirectPath
  )

  return (
    <FormWrapper
      serverError={serverError}
      isError={isError}
      handleSubmit={handleSubmit}
      mode='signup'
    >
      <Input
        {...form.register('username')}
        label='Username'
        placeholder='Enter your username'
        error={form.formState.errors.username?.message}
        autoComplete='username'
      />

      <Input
        {...form.register('email')}
        label='Email'
        placeholder='Enter your email'
        error={form.formState.errors.email?.message}
        autoComplete='email'
      />

      <Input
        {...form.register('password')}
        type='password'
        label='Password'
        placeholder='Enter your password'
        error={form.formState.errors.password?.message}
        autoComplete='new-password'
      />
    </FormWrapper>
  )
}

export const AuthForm = ({
  mode = 'login',
  onAuthenticate = authenticateUser,
  redirectPath
}: ComponentAuthFormProps) => {
  const components = {
    login: <LoginForm onAuthenticate={onAuthenticate} redirectPath={redirectPath} />,
    signup: <SignupForm onAuthenticate={onAuthenticate} redirectPath={redirectPath} />
  }

  return components[mode]
}
