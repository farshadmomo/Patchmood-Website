export type DataSource = 'pocketbase' | 'json'

/**
 * Where the public site reads catalog data from.
 * - `pocketbase` (default): live local PocketBase server — used for development
 *   and the production version with a real backend + admin panel.
 * - `json`: the static snapshot bundled at `src/data/catalog.json` with images
 *   served from `/public/catalog` — used for the Vercel showcase deploy, which
 *   has no PocketBase server to reach.
 *
 * Set via `NEXT_PUBLIC_DATA_SOURCE`. It's a NEXT_PUBLIC_ var so client
 * components (e.g. the navbar) can branch on it too.
 */
export function getDataSource(): DataSource {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === 'json' ? 'json' : 'pocketbase'
}

export const isJsonSource = () => getDataSource() === 'json'
