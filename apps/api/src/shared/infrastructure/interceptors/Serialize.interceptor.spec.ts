import type { CallHandler, ExecutionContext } from '@nestjs/common'
import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import * as classTransformer from 'class-transformer'
import { of } from 'rxjs'

import { SerializeInterceptor } from './Serialize.interceptor'

describe('SerializeInterceptor', () => {
  class TestDto {
    id!: string
    name!: string
  }

  let interceptor: SerializeInterceptor<TestDto>
  let mockCallHandler: CallHandler
  let mockExecutionContext: ExecutionContext
  let plainToClassSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    interceptor = new SerializeInterceptor(TestDto)
    mockCallHandler = {
      handle: mock(() => of({ id: '123', name: 'test', password: 'secret' }))
    }
    mockExecutionContext = {} as ExecutionContext
    plainToClassSpy = spyOn(classTransformer, 'plainToClass')
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should call plainToClass with correct parameters', done => {
    const mockTransformedData = { id: '123', name: 'test' }
    plainToClassSpy.mockReturnValue(mockTransformedData)

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(plainToClassSpy).toHaveBeenCalledWith(
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

    mockCallHandler.handle = mock(() => of(originalData))
    plainToClassSpy.mockReturnValue(transformedData)

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(result).toEqual(transformedData)
      expect(result).not.toHaveProperty('sensitiveField')
      done()
    })
  })

  it('should handle empty data', done => {
    const emptyData = null
    const transformedData = null

    mockCallHandler.handle = mock(() => of(emptyData))
    plainToClassSpy.mockReturnValue(transformedData as unknown as object)

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(plainToClassSpy).toHaveBeenCalledWith(TestDto, null, { excludeExtraneousValues: true })
      expect(result).toBe(transformedData as unknown as TestDto)
      done()
    })
  })
})
