import type { CallHandler, ExecutionContext } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { of } from 'rxjs'

import { SerializeInterceptor } from './Serialize.interceptor'

jest.mock('class-transformer', () => ({
  plainToClass: jest.fn()
}))

describe('SerializeInterceptor', () => {
  class TestDto {
    id!: string
    name!: string
  }

  let interceptor: SerializeInterceptor<TestDto>
  let mockCallHandler: CallHandler
  let mockExecutionContext: ExecutionContext

  beforeEach(() => {
    interceptor = new SerializeInterceptor(TestDto)
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ id: '123', name: 'test', password: 'secret' }))
    }
    mockExecutionContext = {} as ExecutionContext
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should call plainToClass with correct parameters', done => {
    const mockTransformedData = { id: '123', name: 'test' }
    const plainToClassMock = plainToClass as jest.Mock
    plainToClassMock.mockReturnValue(mockTransformedData)

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(plainToClass).toHaveBeenCalledWith(
        TestDto,
        { id: '123', name: 'test', password: 'secret' },
        { excludeExtraneousValues: true }
      )
      expect(result).toBe(mockTransformedData)
      done()
    })
  })

  it('should transform the data using plainToClass', done => {
    const originalData = { id: '123', name: 'test', sensitiveField: 'hidden' }
    const transformedData = { id: '123', name: 'test' }

    mockCallHandler.handle = jest.fn().mockReturnValue(of(originalData))
    const plainToClassMock = plainToClass as jest.Mock
    plainToClassMock.mockReturnValue(transformedData)

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(result).toEqual(transformedData)
      expect(result).not.toHaveProperty('sensitiveField')
      done()
    })
  })

  it('should handle empty data', done => {
    const emptyData = null
    const transformedData = null

    mockCallHandler.handle = jest.fn().mockReturnValue(of(emptyData))
    const plainToClassMock = plainToClass as jest.Mock
    plainToClassMock.mockReturnValue(transformedData)

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(plainToClass).toHaveBeenCalledWith(TestDto, null, { excludeExtraneousValues: true })
      expect(result).toBe(transformedData)
      done()
    })
  })
})
