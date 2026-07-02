/** Resolve Supabase URL/key, ignoring invalid overrides (e.g. Lovable prj_* in VITE_SUPABASE_URL). */

function stripQuotes(value: string | undefined): string | undefined {
  if (!value) return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function isValidHttpUrl(value: string | undefined): boolean {
  const url = stripQuotes(value);
  return !!url && /^https?:\/\//i.test(url);
}

function supabaseUrlFromProjectId(projectId: string | undefined): string | undefined {
  const id = stripQuotes(projectId);
  if (!id || id.startsWith("prj_")) return undefined;
  return `https://${id}.supabase.co`;
}

function readEnv(key: string): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const viteValue = (import.meta.env as Record<string, string | undefined>)[key];
    if (viteValue) return stripQuotes(viteValue);
  }
  return stripQuotes(process.env[key]);
}

export function getSupabaseUrl(): string {
  const candidates = [
    readEnv("SUPABASE_URL"),
    supabaseUrlFromProjectId(readEnv("VITE_SUPABASE_PROJECT_ID")),
    readEnv("VITE_SUPABASE_URL"),
  ];

  for (const url of candidates) {
    if (isValidHttpUrl(url)) return url!;
  }

  throw new Error(
    "Invalid Supabase URL. Set SUPABASE_URL or VITE_SUPABASE_URL to https://<project>.supabase.co in .env (a system VITE_SUPABASE_URL may be overriding your .env file).",
  );
}

export function getSupabaseAnonKey(): string {
  const key =
    readEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ||
    readEnv("SUPABASE_PUBLISHABLE_KEY");

  if (!key) {
    throw new Error(
      "Missing Supabase anon key. Set VITE_SUPABASE_PUBLISHABLE_KEY or SUPABASE_PUBLISHABLE_KEY in .env.",
    );
  }

  return key;
}
