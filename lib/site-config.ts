export type SiteEnvironment = {
  NODE_ENV?: string;
  SITE_MODE?: string;
  SITE_URL?: string;
};

export function resolveSiteConfig(env: SiteEnvironment) {
  const mode = env.SITE_MODE ??
    (env.NODE_ENV === "production" ? "production" : "development");
  if (!["production", "preview", "development"].includes(mode)) {
    throw new Error("SITE_MODE must be production, preview or development.");
  }
  const production = mode === "production";
  const raw = env.SITE_URL?.trim();
  if (production && !raw) {
    throw new Error("Set SITE_URL to the real HTTPS production origin before building. For a non-public review build, set SITE_MODE=preview.");
  }
  if (!raw) return { url: undefined, indexable: false, mode };

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("SITE_URL must be an absolute HTTP(S) origin.");
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must contain only an HTTP(S) origin, without credentials, path, query or fragment.");
  }
  // A trailing DNS dot still refers to the same host (including localhost).
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  const local = host === "localhost" || host.endsWith(".localhost") ||
    host.endsWith(".local") || !host.includes(".") ||
    /^[\d.]+$/.test(host) || host.includes(":");
  const placeholder = /(^|\.)(example\.(com|org|net)|invalid)$/.test(host) ||
    /^(www\.)?(your-domain|your-owned-domain)\./.test(host);
  if (production && (url.protocol !== "https:" || local || placeholder || url.port)) {
    throw new Error("Production SITE_URL must be a public HTTPS origin, without a local address, placeholder domain or custom port.");
  }
  return { url: url.origin, indexable: production, mode };
}
