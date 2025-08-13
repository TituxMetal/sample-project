import { User } from './User.entity'

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create a user with all properties', () => {
      const id = '123'
      const email = 'test@example.com'
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const user = new User(id, email, createdAt, updatedAt)

      expect(user.id).toBe(id)
      expect(user.email).toBe(email)
      expect(user.createdAt).toBe(createdAt)
      expect(user.updatedAt).toBe(updatedAt)
    })
  })

  describe('create', () => {
    it('should create a user with generated id and timestamps', () => {
      const email = 'new@example.com'

      const user = User.create(email)

      expect(user.email).toBe(email)
      expect(user.id).toBeDefined()
      expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
      expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime())
    })

    it('should create users with unique ids', () => {
      const user1 = User.create('user1@example.com')
      const user2 = User.create('user2@example.com')

      expect(user1.id).not.toBe(user2.id)
    })
  })
})
