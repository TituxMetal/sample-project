import { describe, expect, it } from 'bun:test'

import { GetUserProfileDto } from './GetUserProfile.dto'

describe('GetUserProfileDto', () => {
  it('should create instance with all properties', () => {
    const dto = new GetUserProfileDto()
    dto.id = '123e4567-e89b-12d3-a456-426614174000'
    dto.email = 'john@example.com'
    dto.username = 'johndoe'
    dto.firstName = 'John'
    dto.lastName = 'Doe'
    dto.confirmed = true
    dto.blocked = false
    dto.createdAt = new Date('2024-01-01')
    dto.updatedAt = new Date('2024-01-02')

    expect(dto).toBeInstanceOf(GetUserProfileDto)
    expect(dto.id).toBe('123e4567-e89b-12d3-a456-426614174000')
    expect(dto.email).toBe('john@example.com')
    expect(dto.username).toBe('johndoe')
    expect(dto.firstName).toBe('John')
    expect(dto.lastName).toBe('Doe')
    expect(dto.confirmed).toBe(true)
    expect(dto.blocked).toBe(false)
    expect(dto.createdAt).toEqual(new Date('2024-01-01'))
    expect(dto.updatedAt).toEqual(new Date('2024-01-02'))
  })

  it('should create instance with undefined optional properties', () => {
    const dto = new GetUserProfileDto()
    dto.id = '123e4567-e89b-12d3-a456-426614174000'
    dto.email = 'john@example.com'
    dto.username = 'johndoe'
    dto.confirmed = true
    dto.blocked = false
    dto.createdAt = new Date('2024-01-01')
    dto.updatedAt = new Date('2024-01-02')

    expect(dto.firstName).toBeUndefined()
    expect(dto.lastName).toBeUndefined()
  })

  it('should be serializable to JSON', () => {
    const dto = new GetUserProfileDto()
    dto.id = '123e4567-e89b-12d3-a456-426614174000'
    dto.email = 'john@example.com'
    dto.username = 'johndoe'
    dto.firstName = 'John'
    dto.lastName = 'Doe'
    dto.confirmed = true
    dto.blocked = false
    dto.createdAt = new Date('2024-01-01')
    dto.updatedAt = new Date('2024-01-02')

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.id).toBe('123e4567-e89b-12d3-a456-426614174000')
    expect(parsed.email).toBe('john@example.com')
    expect(parsed.username).toBe('johndoe')
    expect(parsed.firstName).toBe('John')
    expect(parsed.lastName).toBe('Doe')
    expect(parsed.confirmed).toBe(true)
    expect(parsed.blocked).toBe(false)
    expect(parsed.createdAt).toBe('2024-01-01T00:00:00.000Z')
    expect(parsed.updatedAt).toBe('2024-01-02T00:00:00.000Z')
  })
})
