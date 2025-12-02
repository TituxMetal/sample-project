import { describe, expect, it } from 'bun:test'

import { RegisterDto } from './Register.dto'

describe('RegisterDto', () => {
  it('should create instance with required fields', () => {
    const registerDto = new RegisterDto('user@example.com', 'username', 'password123')

    expect(registerDto).toBeInstanceOf(RegisterDto)
    expect(registerDto.email).toBe('user@example.com')
    expect(registerDto.username).toBe('username')
    expect(registerDto.password).toBe('password123')
    expect(registerDto.firstName).toBeUndefined()
    expect(registerDto.lastName).toBeUndefined()
  })

  it('should create instance with all fields', () => {
    const registerDto = new RegisterDto(
      'user@example.com',
      'username',
      'password123',
      'John',
      'Doe'
    )

    expect(registerDto).toBeInstanceOf(RegisterDto)
    expect(registerDto.email).toBe('user@example.com')
    expect(registerDto.username).toBe('username')
    expect(registerDto.password).toBe('password123')
    expect(registerDto.firstName).toBe('John')
    expect(registerDto.lastName).toBe('Doe')
  })

  it('should create instance with only firstName', () => {
    const registerDto = new RegisterDto('user@example.com', 'username', 'password123', 'John')

    expect(registerDto.firstName).toBe('John')
    expect(registerDto.lastName).toBeUndefined()
  })

  it('should handle empty optional fields', () => {
    const registerDto = new RegisterDto('user@example.com', 'username', 'password123', '', '')

    expect(registerDto.firstName).toBe('')
    expect(registerDto.lastName).toBe('')
  })

  it('should handle special characters in fields', () => {
    const registerDto = new RegisterDto(
      'user+tag@example.com',
      'user_name',
      'p@ssw0rd!',
      'Jean-Luc',
      "O'Connor"
    )

    expect(registerDto.email).toBe('user+tag@example.com')
    expect(registerDto.username).toBe('user_name')
    expect(registerDto.password).toBe('p@ssw0rd!')
    expect(registerDto.firstName).toBe('Jean-Luc')
    expect(registerDto.lastName).toBe("O'Connor")
  })
})
