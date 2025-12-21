import { describe, expect, it } from 'bun:test'

import { updateProfileSchema, userSchema } from './user.schema'

const validUser = {
  username: 'valid_user123',
  firstName: 'John',
  lastName: 'Doe'
}

describe('userSchema', () => {
  it('accepts valid user data', () => {
    const data = validUser

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(true)
  })

  it('rejects username that is too short', () => {
    const data = { ...validUser, username: 'ab' }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects username that is too long', () => {
    const data = { ...validUser, username: 'a'.repeat(31) }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects username with invalid characters', () => {
    const data = { ...validUser, username: 'invalid*user' }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects missing username', () => {
    const { username, ...rest } = validUser
    const data = rest

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects firstName that is too short', () => {
    const data = { ...validUser, firstName: 'A' }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects firstName that is too long', () => {
    const data = { ...validUser, firstName: 'A'.repeat(51) }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects firstName with invalid characters', () => {
    const data = { ...validUser, firstName: 'John123' }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects missing firstName', () => {
    const { firstName, ...rest } = validUser
    const data = rest

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects lastName that is too short', () => {
    const data = { ...validUser, lastName: 'B' }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects lastName that is too long', () => {
    const data = { ...validUser, lastName: 'B'.repeat(51) }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects lastName with invalid characters', () => {
    const data = { ...validUser, lastName: 'Doe!' }

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects missing lastName', () => {
    const { lastName, ...rest } = validUser
    const data = rest

    const parsed = userSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })
})

describe('updateProfileSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    const data = {}

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(true)
  })

  it('accepts valid partial update (username only)', () => {
    const data = { username: 'valid_user' }

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(true)
  })

  it('accepts valid partial update (firstName only)', () => {
    const data = { firstName: 'Jane' }

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(true)
  })

  it('accepts valid partial update (lastName only)', () => {
    const data = { lastName: 'Smith' }

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(true)
  })

  it('accepts valid full update', () => {
    const data = validUser

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(true)
  })

  it('rejects invalid username if present', () => {
    const data = { username: 'a' }

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects invalid firstName if present', () => {
    const data = { firstName: '1' }

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })

  it('rejects invalid lastName if present', () => {
    const data = { lastName: '!' }

    const parsed = updateProfileSchema.safeParse(data)

    expect(parsed.success).toBe(false)
  })
})
