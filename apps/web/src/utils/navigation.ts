/**
 * Redirects the user to the specified path
 * This is a client-side utility for redirection after form submission
 */
export const redirect = (path: string): void => {
  window.location.href = path
}
