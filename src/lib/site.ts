const DEFAULT_SITE_URL = 'https://blocks.mksaas.link';

// Public base URL of the deployment, used for canonical and social metadata.
// Override per environment with the VITE_BASE_URL build-time variable.
export const SITE_URL = (
  import.meta.env.VITE_BASE_URL ?? DEFAULT_SITE_URL
).replace(/\/+$/, '');

export function siteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
