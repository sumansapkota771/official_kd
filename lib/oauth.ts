const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PROD_SITE = process.env.NEXT_PUBLIC_SITE_URL_PROD ?? "https://www.kodedristi.com";

export function resolveRedirectUri(host?: string | null): string {
  const isProdHost =
    host?.includes("kodedristi.com") || host?.includes("vercel.app") || host?.includes("netlify.app");
  if (isProdHost) {
    return process.env.GOOGLE_REDIRECT_URI_PROD ?? `${PROD_SITE}/api/auth/google/callback`;
  }
  return process.env.GOOGLE_REDIRECT_URI ?? `${SITE}/api/auth/google/callback`;
}
