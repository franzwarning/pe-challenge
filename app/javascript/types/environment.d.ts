declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_ANON_PUBLIC_KEY: string
      SUPABASE_URL: string
      NODE_ENV: string
      DEBUG: string
    }
  }
}
export {}
