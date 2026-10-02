const env = {
  appName: import.meta.env.VITE_APP_NAME,
  apiBaseURI: import.meta.env.VITE_API_URL ?? '/api/v1',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 15000)
}

export default env
