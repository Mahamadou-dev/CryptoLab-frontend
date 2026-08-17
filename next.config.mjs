/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ni `eslint.ignoreDuringBuilds` ni `typescript.ignoreBuildErrors` ici :
  //   - la cle `eslint` n'existe plus dans Next 16.3, le lint a son propre job
  //     de CI ;
  //   - `ignoreBuildErrors` laissait passer en production des erreurs de type
  //     que `pnpm typecheck` signalait deja.
  // Next 16 ecrit un AGENTS.md et un CLAUDE.md a la racine du projet a chaque
  // demarrage du serveur de developpement. Le depot a deja sa documentation, et
  // un CLAUDE.md genere entrerait en conflit avec celui du projet.
  agentRules: false,

  images: {
    unoptimized: true,
  },
}

export default nextConfig
