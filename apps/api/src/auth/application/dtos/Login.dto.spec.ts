import { LoginDto } from './Login.dto'

describe('LoginDto', () => {
  it('should create instance with email and password', () => {
    const loginDto = new LoginDto('user@example.com', 'password123')

    expect(loginDto).toBeInstanceOf(LoginDto)
    expect(loginDto.emailOrUsername).toBe('user@example.com')
    expect(loginDto.password).toBe('password123')
  })

  it('should create instance with username and password', () => {
    const loginDto = new LoginDto('username', 'password123')

    expect(loginDto).toBeInstanceOf(LoginDto)
    expect(loginDto.emailOrUsername).toBe('username')
    expect(loginDto.password).toBe('password123')
  })

  it('should handle empty strings', () => {
    const loginDto = new LoginDto('', '')

    expect(loginDto.emailOrUsername).toBe('')
    expect(loginDto.password).toBe('')
  })

  it('should handle special characters in credentials', () => {
    const loginDto = new LoginDto('user+tag@example.com', 'p@ssw0rd!')

    expect(loginDto.emailOrUsername).toBe('user+tag@example.com')
    expect(loginDto.password).toBe('p@ssw0rd!')
  })
})
