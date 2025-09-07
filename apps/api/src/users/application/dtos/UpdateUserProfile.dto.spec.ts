import { UpdateUserProfileDto } from './UpdateUserProfile.dto'

describe('UpdateUserProfileDto', () => {
  it('should create instance with all properties', () => {
    const dto = new UpdateUserProfileDto()
    dto.username = 'johndoe'
    dto.firstName = 'John'
    dto.lastName = 'Doe'

    expect(dto).toBeInstanceOf(UpdateUserProfileDto)
    expect(dto.username).toBe('johndoe')
    expect(dto.firstName).toBe('John')
    expect(dto.lastName).toBe('Doe')
  })

  it('should create instance with undefined properties', () => {
    const dto = new UpdateUserProfileDto()

    expect(dto.username).toBeUndefined()
    expect(dto.firstName).toBeUndefined()
    expect(dto.lastName).toBeUndefined()
  })

  it('should create instance with partial properties', () => {
    const dto = new UpdateUserProfileDto()
    dto.username = 'newusername'

    expect(dto.username).toBe('newusername')
    expect(dto.firstName).toBeUndefined()
    expect(dto.lastName).toBeUndefined()
  })

  it('should be serializable to JSON', () => {
    const dto = new UpdateUserProfileDto()
    dto.username = 'johndoe'
    dto.firstName = 'John'
    dto.lastName = 'Doe'

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.username).toBe('johndoe')
    expect(parsed.firstName).toBe('John')
    expect(parsed.lastName).toBe('Doe')
  })

  it('should handle empty string values', () => {
    const dto = new UpdateUserProfileDto()
    dto.username = ''
    dto.firstName = ''
    dto.lastName = ''

    expect(dto.username).toBe('')
    expect(dto.firstName).toBe('')
    expect(dto.lastName).toBe('')
  })

  it('should handle undefined values properly', () => {
    const dto = new UpdateUserProfileDto()
    dto.firstName = undefined
    dto.lastName = undefined

    expect(dto.firstName).toBeUndefined()
    expect(dto.lastName).toBeUndefined()
  })
})
