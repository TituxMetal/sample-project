import { atom, computed } from 'nanostores'
import type { User } from '~/types/user.types'

export const $user = atom<User | null>(null)
export const $isLoading = atom<boolean>(false)
export const $isAuthenticated = computed($user, user => !!user)

export const authStore = {
  setUser: (user: User | null) => {
    $user.set(user)
  },

  clearUser: () => {
    $user.set(null)
  },

  setLoading: (loading: boolean) => {
    $isLoading.set(loading)
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = $user.get()
    if (currentUser) {
      $user.set({ ...currentUser, ...updates })
    }
  }
}
