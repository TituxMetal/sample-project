import type { UserResponseDto } from '@packages/types'

interface WelcomeUserProps {
  title: string
  pageDescription?: string
  user?: UserResponseDto
  children?: React.ReactNode
}

export const Welcome = ({ title, user, pageDescription, children }: WelcomeUserProps) => {
  return (
    <section className='mx-auto my-6 flex w-full max-w-screen-xl flex-col gap-4 rounded-md bg-sky-950 px-4 py-8'>
      <h1 className='mb-4 text-3xl font-bold'>{title}</h1>

      <section className='mx-4 flex max-w-screen-lg flex-col gap-4'>
        {pageDescription && <p className='text-lg'>{pageDescription}</p>}

        {children}
      </section>

      {user && (
        <section className='flex flex-col gap-2'>
          <h2 className='mb-4 text-xl font-bold'>User Data</h2>
          <code className='ml-4 flex max-w-lg flex-col gap-2'>
            <pre className='rounded-md bg-zinc-800 p-4'>{JSON.stringify(user, null, 2)}</pre>
          </code>
        </section>
      )}
    </section>
  )
}
