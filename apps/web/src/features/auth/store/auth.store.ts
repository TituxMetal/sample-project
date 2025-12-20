import { atom, computed } from 'nanostores'

import type { User } from '~/types'

import { getCurrentUser } from '../api/auth.service'

// State atoms
export const $user = atom<User | null>(null)
export const $isLoading = atom<boolean>(false)
export const $error = atom<string | null>(null)

// Computed values
export const $isAuthenticated = computed($user, user => !!user)
export const $hasError = computed($error, error => !!error)
export const $userDisplayName = computed($user, user =>
  user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest'
)

export const authActions = {
  async refresh() {
    try {
      $isLoading.set(true)
      $error.set(null)
      const user = await getCurrentUser()
      $user.set(user)
    } catch (error) {
      $user.set(null)
      // Don't set error for expected auth failures (401, etc.)
      if (!(error instanceof Error) || !error.message.includes('401')) {
        $error.set(error instanceof Error ? error.message : 'Failed to refresh user')
      }
    } finally {
      $isLoading.set(false)
    }
  },

  // Utility actions
  clearError() {
    $error.set(null)
  },

  setInitialUser(user: User | null) {
    $user.set(user)
    $error.set(null)
  },

  async silentRefresh() {
    try {
      const user = await getCurrentUser()
      $user.set(user)
      $error.set(null)
    } catch (error) {
      $user.set(null)
      // Silent failure - don't set error state
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = $user.get()
    if (currentUser) {
      $user.set({ ...currentUser, ...updates })
    }
  }
}
