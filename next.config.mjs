/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ni `eslint.ignoreDuringBuilds` ni `typescript.ignoreBuildErrors` ici :
  //   - la cle `eslint` n'existe plus dans Next 16.3, le lint a son propre job
  //     de CI ;
  //   - `ignoreBuildErrors` laissait passer en production des erreurs de type
  //     que `pnpm typecheck` signalait deja.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
