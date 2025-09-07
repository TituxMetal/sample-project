import { UseInterceptors, applyDecorators } from '@nestjs/common'

import { SerializeInterceptor } from '~/shared/infrastructure/interceptors/Serialize.interceptor'

import { Serialize } from './Serialize.decorator'

// Mock the required imports
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  UseInterceptors: jest.fn(),
  applyDecorators: jest.fn()
}))

jest.mock('~/shared/infrastructure/interceptors/Serialize.interceptor')

describe('Serialize Decorator', () => {
  class TestDto {
    id!: string
    name!: string
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a SerializeInterceptor with the provided DTO', () => {
    Serialize(TestDto)

    expect(SerializeInterceptor).toHaveBeenCalledWith(TestDto)
  })

  it('should call UseInterceptors with SerializeInterceptor instance', () => {
    const mockInterceptor = new SerializeInterceptor(TestDto)
    const serializeInterceptorMock = SerializeInterceptor as jest.Mock
    serializeInterceptorMock.mockImplementation(() => mockInterceptor)

    Serialize(TestDto)

    expect(UseInterceptors).toHaveBeenCalledWith(mockInterceptor)
  })

  it('should call applyDecorators with UseInterceptors result', () => {
    const mockUseInterceptors = 'mock-use-interceptors-result'
    const useInterceptorsMock = UseInterceptors as jest.Mock
    useInterceptorsMock.mockReturnValue(mockUseInterceptors)

    Serialize(TestDto)

    expect(applyDecorators).toHaveBeenCalledWith(mockUseInterceptors)
  })

  it('should return the result of applyDecorators', () => {
    const expectedResult = 'mock-decorator-result'
    const applyDecoratorsMock = applyDecorators as jest.Mock
    applyDecoratorsMock.mockReturnValue(expectedResult)

    const result = Serialize(TestDto)

    expect(result).toBe(expectedResult)
  })
})
