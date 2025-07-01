import { z } from "zod";

// Client-side environment variables (NEXT_PUBLIC_ prefix required)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Supabase URL gerekli"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase Anon Key gerekli"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Stripe Publishable Key gerekli"),
});

// Server-side environment variables
const serverEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe Secret Key gerekli"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

// Parse client environment variables
const parseClientEnv = () => {
  try {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_qblFNYngBkEdjEZ16jxxoWSM",
    }
    return clientEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join("."));
      console.error("❌ Client environment variables eksik:", missingVars.join(", "));
      console.error("📝 NEXT_PUBLIC_ prefix'li değişkenler gerekli");
      console.error("🔧 .env.local dosyasını kontrol edin");
    }
    throw error;
  }
};

// Parse server environment variables (only on server-side)
const parseServerEnv = () => {
  if (typeof window !== 'undefined') {
    // Client-side'da server env'leri kullanma
    return {
      STRIPE_SECRET_KEY: '',
      NODE_ENV: 'development' as const,
      UPSTASH_REDIS_REST_URL: undefined,
      UPSTASH_REDIS_REST_TOKEN: undefined,
    };
  }

  try {
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join("."));
      console.error("❌ Server environment variables eksik:", missingVars.join(", "));
      console.error("🔧 .env.local dosyasını kontrol edin");
    }
    throw error;
  }
};

// Export client environment variables (safe for client-side)
export const clientEnv = parseClientEnv();

// Export server environment variables (server-side only)
export const serverEnv = parseServerEnv();

// Combined env for backward compatibility
export const env = {
  ...clientEnv,
  ...serverEnv,
};
