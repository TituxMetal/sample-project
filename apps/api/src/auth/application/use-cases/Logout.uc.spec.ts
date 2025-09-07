import { LogoutUseCase } from './Logout.uc'

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase
  let mockTokenBlacklistService: { blacklistToken: jest.Mock }

  beforeEach(() => {
    mockTokenBlacklistService = {
      blacklistToken: jest.fn()
    }

    logoutUseCase = new LogoutUseCase(mockTokenBlacklistService)
  })

  describe('execute', () => {
    it('should logout successfully by blacklisting token', async () => {
      const token = 'jwt-token-123'

      mockTokenBlacklistService.blacklistToken.mockResolvedValue(undefined)

      const result = await logoutUseCase.execute(token)

      expect(result).toEqual({ success: true })
      expect(mockTokenBlacklistService.blacklistToken).toHaveBeenCalledWith(token)
    })

    it('should handle logout without token', async () => {
      const result = await logoutUseCase.execute()

      expect(result).toEqual({ success: true })
      expect(mockTokenBlacklistService.blacklistToken).not.toHaveBeenCalled()
    })
  })
})
