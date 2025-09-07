import { validate } from 'class-validator'

import { IsPassword, IsUsername, IsName } from './Validation.decorators'

class TestDto {
  @IsPassword()
  password!: string

  @IsUsername()
  username!: string

  @IsName()
  name!: string
}

describe('Validation Decorators', () => {
  let dto: TestDto

  beforeEach(() => {
    dto = new TestDto()
  })

  describe('IsPassword', () => {
    it('should pass validation for valid passwords', async () => {
      dto.password = 'ValidPass123!'
      dto.username = 'testuser'
      dto.name = 'Test User'

      const errors = await validate(dto)
      const passwordErrors = errors.filter(error => error.property === 'password')
      expect(passwordErrors).toHaveLength(0)
    })

    it('should fail validation for invalid passwords', async () => {
      dto.password = 'weak'
      dto.username = 'testuser'
      dto.name = 'Test User'

      const errors = await validate(dto)
      const passwordErrors = errors.filter(error => error.property === 'password')
      expect(passwordErrors.length).toBeGreaterThan(0)
    })
  })

  describe('IsUsername', () => {
    it('should pass validation for valid usernames', async () => {
      dto.password = 'ValidPass123!'
      dto.username = 'valid_user123'
      dto.name = 'Test User'

      const errors = await validate(dto)
      const usernameErrors = errors.filter(error => error.property === 'username')
      expect(usernameErrors).toHaveLength(0)
    })

    it('should fail validation for invalid usernames', async () => {
      dto.password = 'ValidPass123!'
      dto.username = 'ab' // too short
      dto.name = 'Test User'

      const errors = await validate(dto)
      const usernameErrors = errors.filter(error => error.property === 'username')
      expect(usernameErrors.length).toBeGreaterThan(0)
    })
  })

  describe('IsName', () => {
    it('should pass validation for valid names', async () => {
      dto.password = 'ValidPass123!'
      dto.username = 'testuser'
      dto.name = 'John Doe'

      const errors = await validate(dto)
      const nameErrors = errors.filter(error => error.property === 'name')
      expect(nameErrors).toHaveLength(0)
    })

    it('should fail validation for invalid names', async () => {
      dto.password = 'ValidPass123!'
      dto.username = 'testuser'
      dto.name = 'Invalid123' // contains numbers

      const errors = await validate(dto)
      const nameErrors = errors.filter(error => error.property === 'name')
      expect(nameErrors.length).toBeGreaterThan(0)
    })
  })
})
