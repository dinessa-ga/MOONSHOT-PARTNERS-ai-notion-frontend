const TOKEN_NAME = 'chat-token';

/**
 * Get the authentication token from the localStorage or sessionStorage.
 * @returns {string} The authentication token if it exists, otherwise an empty string.
 */
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_NAME);
  const sessionToken = sessionStorage.getItem(TOKEN_NAME);
  if (token) {
    return token;
  }
  if (sessionToken) {
    return sessionToken;
  }
  return '';
};

/**
 * Set the authentication token in the localStorage or sessionStorage.
 * @param {string} token - The authentication token to be set.
 * @param {boolean} [rememberMe=true] - A boolean value indicating whether to store the token in the localStorage or sessionStorage.
 * If rememberMe is true, the token will be stored in localStorage; otherwise, it will be stored in sessionStorage.
 * @returns {void}
 */
export const setToken = (token, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_NAME, token);
  } else {
    sessionStorage.setItem(TOKEN_NAME, token);
  }
};

/**
 * Remove the authentication token from the localStorage and sessionStorage.
 * @returns {void}
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_NAME);
  sessionStorage.removeItem(TOKEN_NAME);
};
