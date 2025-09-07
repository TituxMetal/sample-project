import { CreateUserDto } from './CreateUser.dto'

describe('CreateUserDto', () => {
  it('should create instance with all properties', () => {
    const dto = new CreateUserDto()
    dto.email = 'john@example.com'
    dto.username = 'johndoe'
    dto.password = 'password123'
    dto.firstName = 'John'
    dto.lastName = 'Doe'

    expect(dto).toBeInstanceOf(CreateUserDto)
    expect(dto.email).toBe('john@example.com')
    expect(dto.username).toBe('johndoe')
    expect(dto.password).toBe('password123')
    expect(dto.firstName).toBe('John')
    expect(dto.lastName).toBe('Doe')
  })

  it('should create instance without optional properties', () => {
    const dto = new CreateUserDto()
    dto.email = 'john@example.com'
    dto.username = 'johndoe'
    dto.password = 'password123'

    expect(dto.firstName).toBeUndefined()
    expect(dto.lastName).toBeUndefined()
  })

  it('should be serializable to JSON', () => {
    const dto = new CreateUserDto()
    dto.email = 'john@example.com'
    dto.username = 'johndoe'
    dto.password = 'password123'
    dto.firstName = 'John'
    dto.lastName = 'Doe'

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.email).toBe('john@example.com')
    expect(parsed.username).toBe('johndoe')
    expect(parsed.password).toBe('password123')
    expect(parsed.firstName).toBe('John')
    expect(parsed.lastName).toBe('Doe')
  })

  it('should handle empty string values', () => {
    const dto = new CreateUserDto()
    dto.email = 'john@example.com'
    dto.username = 'johndoe'
    dto.password = 'password123'
    dto.firstName = ''
    dto.lastName = ''

    expect(dto.firstName).toBe('')
    expect(dto.lastName).toBe('')
  })
})
