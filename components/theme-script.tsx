/**
 * Applique le theme avant le premier pixel peint.
 *
 * Le probleme qu'il resout : le theme choisi vit dans `localStorage`, que le
 * serveur ne peut pas lire. Sans ce script, la page s'afficherait d'abord avec
 * le theme par defaut, puis basculerait au montage de React — le « flash » de
 * theme, particulierement violent entre clair et sombre.
 *
 * La solution habituelle — ne rien rendre tant que React n'est pas monte —
 * revient a livrer une page vide aux moteurs de recherche. Ici, le script est
 * bloquant et pose les classes sur <html> avant que quoi que ce soit ne soit
 * peint, ce qui permet au contenu d'etre rendu cote serveur.
 *
 * Il est volontairement minuscule, sans dependance, et enferme dans un
 * try/catch : `localStorage` leve une exception en navigation privee sur
 * certains navigateurs, et un theme manquant ne doit jamais empecher la page
 * de s'afficher.
 */
const SCRIPT = `
(function () {
  try {
    var root = document.documentElement;
    var mode = localStorage.getItem('theme') || 'system';
    var color = localStorage.getItem('colorTheme') || 'gemini';
    var dark = mode === 'dark' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', dark);
    root.classList.add('theme-' + color);
  } catch (e) {
    // Stockage inaccessible : on garde le theme par defaut de la feuille.
  }
})();
`

export function ThemeScript() {
    // `dangerouslySetInnerHTML` est ici le mecanisme prevu : le script est une
    // constante ecrite a la main, aucune donnee utilisateur n'y entre.
    return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
}
