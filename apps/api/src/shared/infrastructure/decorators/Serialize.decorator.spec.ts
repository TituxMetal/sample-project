import { describe, expect, it } from 'bun:test'

import { Serialize } from './Serialize.decorator'

describe('Serialize Decorator', () => {
  class TestDto {
    id!: string
    name!: string
  }

  it('should return a function (decorator)', () => {
    const decorator = Serialize(TestDto)

    expect(typeof decorator).toBe('function')
  })

  it('should be applicable to a class', () => {
    // The decorator should not throw when applied
    expect(() => {
      @Serialize(TestDto)
      class TestController {
        getTest() {
          return { id: '1', name: 'test' }
        }
      }
      return TestController
    }).not.toThrow()
  })

  it('should be applicable to a method', () => {
    // The decorator should not throw when applied to a method
    expect(() => {
      class TestController {
        @Serialize(TestDto)
        getTest() {
          return { id: '1', name: 'test' }
        }
      }
      return TestController
    }).not.toThrow()
  })
})
