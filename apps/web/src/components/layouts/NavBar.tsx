import { VscAccount, VscHome, VscSignIn, VscSignOut } from 'react-icons/vsc'

// const linkClasses = 'flex flex-col items-center gap-2 hover:text-amber-200 lg:flex-row'

export const NavBar = () => {
  return (
    <header className='flex items-center justify-between bg-sky-900 p-6 font-semibold text-sky-200'>
      <nav className='mx-auto flex w-full max-w-screen-xl gap-4'>
        <ul className='flex w-full items-center justify-around'>
          <li>
            <a href='/' className='navLink'>
              <VscHome className='icon' aria-label='Home' />
              Home
            </a>
          </li>
          <li>
            <a href='/profile' className='navLink'>
              <VscAccount className='icon' aria-label='Profile' />
              Titux Metal
            </a>
          </li>
          <li>
            <a href='/logout' className='navLink'>
              <VscSignOut className='icon' aria-label='Logout' />
              Logout
            </a>
          </li>
          <li>
            <a href='/auth' className='navLink'>
              <VscSignIn className='icon' aria-label='Authentication' />
              Auth
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
