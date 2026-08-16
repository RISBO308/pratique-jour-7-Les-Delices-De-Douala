# AGENTS.md — delices-de-douala-tp

> Fichier de règles cross-tool (lu par Antigravity, GitHub Copilot, Claude Code, Cursor).
> Placer ce fichier à la racine du projet Angular `delices-de-douala-tp`.
> Tout agent qui travaille sur ce dépôt DOIT lire ce fichier avant de générer du code.

---

## 1. Contexte du projet

Ce dépôt contient **deux travaux pratiques (TP) du cursus Angular Talent Lab 2026 (ATL2026)**, réunis dans **un seul projet Angular** (décision explicite du propriétaire du projet — ne pas les séparer en deux workspaces) :

- **TP1 — Notation de restaurants** (individuel) : grille de 6 restaurants de Douala, notation 5 étoiles, compteur en temps réel.
- **TP2 — Couche de données** (binôme) : carte de plats servie par un service Angular, chargée en HTTP, filtrable par catégorie, avec un "plat du jour" rotatif.

Les deux TP partagent le même `app.config.ts`, la même configuration d'environnement, et sont affichés sur **une seule page** (`app.html`) — il n'y a **pas de routing** entre les deux fonctionnalités, car le routing n'est enseigné qu'au cours suivant (J9) et n'est donc pas autorisé dans ce rendu.

Ce projet est noté par un formateur selon une grille précise (voir §8). **Le code doit respecter à la lettre les conventions ci-dessous : chaque pattern interdit détecté fait perdre des points, indépendamment de la qualité du code.**

---

## 2. Stack technique

- Angular 20–22 (dernière version stable compatible), composants **standalone** uniquement.
- TypeScript strict, interfaces pour tous les modèles de données.
- CSS natif (pas de Sass/Less, pas de framework UI externe type Bootstrap/Material).
- Aucune librairie tierce en dehors de ce que fournit Angular (RxJS est inclus nativement).
- Serveur de dev : `ng serve --host 0.0.0.0 --port 8080`.
- Commits **conventionnels** (`feat:`, `fix:`, `chore:`, etc.), un commit par étape logique.

---

## 3. Règles ATL2026 — NON NÉGOCIABLES

Ces règles priment sur toute pratique Angular "moderne" alternative ou toute préférence par défaut d'un agent. Elles viennent directement des supports de cours du formateur et sont vérifiées à la notation.

### ✅ Toujours utiliser
| Besoin | Pattern imposé |
|---|---|
| État d'un composant/service | `signal()`, `computed()` |
| Exposer un état en lecture seule depuis un service | `signal` privé + `.asReadonly()` |
| Injection de dépendance | `inject()` |
| Recevoir une donnée du parent | `input<T>()` / `input.required<T>()` |
| Émettre un événement vers le parent | `output<T>()` + `.emit()` |
| Boucle dans un template | `@for (x of xs(); track x.id)` |
| Condition dans un template | `@if` / `@else` |
| Lecture HTTP (GET) | `httpResource()` |
| Écriture HTTP (POST/PUT/DELETE) | `HttpClient` injecté directement |
| Activer HttpClient | `provideHttpClient()` dans `app.config.ts` |
| Consommer un flux RxJS pour l'affichage | `toSignal(obs$, { initialValue })` |
| Consommer un flux RxJS avec effets de bord | `.pipe(takeUntilDestroyed()).subscribe(...)` |
| Variables de config | `environment.ts` (base=prod) + `environment.development.ts`, importées **toujours** sans suffixe |

### 🚫 Interdits — pénalité automatique si détecté
- `@Input()` / `@Output()` décorateurs, `EventEmitter` → utiliser `input()`/`output()`.
- `*ngIf` / `*ngFor` → utiliser `@if`/`@for`.
- Injection par **constructeur** → utiliser `inject()`.
- `ngOnInit` pour initialiser des données → l'état s'initialise à la déclaration du signal/resource.
- `NgModule` (`@NgModule`, `HttpClientModule`) → tout est standalone, `provideHttpClient()`.
- `subscribe()` sans nettoyage (ni `takeUntilDestroyed()` ni `toSignal()`) → fuite mémoire.
- Import de `environment.development` ou `environment.prod` explicitement → toujours `environment` tout court.
- Données du menu/restaurants réécrites "en dur" dans un composant au lieu du service/JSON prévu.
- Toute librairie UI externe, tout state management externe (NgRx, etc.), toute authentification, tout backend réel : **hors périmètre, ne pas ajouter**.

---

## 4. Arborescence cible

```
delices-de-douala-tp/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   ├── restaurant.ts          # TP1
│   │   │   └── plat.ts                # TP2
│   │   ├── services/
│   │   │   └── menu.service.ts        # TP2 uniquement
│   │   ├── components/
│   │   │   ├── header/                # TP1
│   │   │   ├── restaurant-list/       # TP1
│   │   │   ├── restaurant-card/       # TP1
│   │   │   ├── star-rating/           # TP1
│   │   │   └── carte/                 # TP2
│   │   ├── app.ts / app.html / app.css
│   │   └── app.config.ts              # provideHttpClient() ici
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   └── ...
└── public/
    └── api/
        └── plats.json                 # "serveur" statique pour TP2
```

**Statut actuel du projet** (ne pas régénérer ce qui existe déjà) :
- ✅ Projet Angular créé (`ng new delices-de-douala-tp --style=css --ssr=false`).
- ✅ `src/app/models/restaurant.ts` créé.
- ⏳ Tout le reste reste à construire.

---

## 5. Modèles de données (imposés — ne pas inventer d'autres champs)

### `src/app/models/restaurant.ts` (TP1)
```typescript
export interface Restaurant {
  id: number;
  name: string;
  district: string;
  specialty: string;
  currentRating: number; // 0 = non noté
}
```

Données de départ imposées (à placer dans un `signal` au niveau de `App`) :
```typescript
[
  { id: 1, name: 'Le Calao Doré', district: 'Akwa', specialty: 'Ndolé aux crevettes', currentRating: 0 },
  { id: 2, name: 'Chez Madame Ngono', district: 'Bonapriso', specialty: 'Eru aux pieds de bœuf', currentRating: 0 },
  { id: 3, name: 'La Fourchette Camerounaise', district: 'Bonanjo', specialty: 'Poulet DG', currentRating: 0 },
  { id: 4, name: 'Saveurs du Wouri', district: 'Bonamoussadi', specialty: 'Poisson braisé', currentRating: 0 },
  { id: 5, name: "L'Akwa Gourmand", district: 'Akwa', specialty: 'Bobolo et sauce arachide', currentRating: 0 },
  { id: 6, name: 'Le Royal de Bali', district: 'Bali', specialty: 'Koki et plantain', currentRating: 0 }
]
```

### `src/app/models/plat.ts` (TP2)
```typescript
export interface Plat {
  id: string;
  nom: string;
  prix: number;       // en FCFA (XAF)
  categorie: string;
  disponible: boolean;
}
```

### `public/api/plats.json` (TP2 — sert de "serveur" via httpResource)
```json
[
  { "id": "d1", "nom": "Ndolè aux crevettes", "prix": 3500, "categorie": "Plats", "disponible": true },
  { "id": "d2", "nom": "Poulet DG", "prix": 4000, "categorie": "Plats", "disponible": true },
  { "id": "d3", "nom": "Poisson braisé + miondo", "prix": 3000, "categorie": "Grillades", "disponible": true },
  { "id": "d4", "nom": "Eru + water fufu", "prix": 2500, "categorie": "Plats", "disponible": true },
  { "id": "d5", "nom": "Koki + plantain mûr", "prix": 2000, "categorie": "Végétarien", "disponible": true },
  { "id": "d6", "nom": "Jus de bissap", "prix": 1000, "categorie": "Boissons", "disponible": true },
  { "id": "d7", "nom": "Jus de gingembre", "prix": 1000, "categorie": "Boissons", "disponible": false }
]
```

---

## 6. Spécification des composants — TP1 (notation)

| Composant | Reçoit (input) | Émet (output) | Responsabilité |
|---|---|---|---|
| `App` | — | — | Détient `restaurants = signal<Restaurant[]>([...])` ; `computed()` pour `ratedCount` (nb de restaurants avec `currentRating > 0`) ; passe `ratedCount` à `Header` ; passe `restaurants` à `RestaurantList` ; écoute l'output de mise à jour de note et met à jour le signal via `.update()` avec un nouveau tableau (`.map()`, jamais de mutation directe) |
| `Header` | `ratedCount: number` | — | Affiche le titre + `★ {{ratedCount()}} / 6 restaurants notés` |
| `RestaurantList` | `restaurants: Restaurant[]` | `restaurantRated(Restaurant)` | `@for` sur les restaurants, une `RestaurantCard` par restaurant, relaie l'output vers `App` |
| `RestaurantCard` | `restaurant: Restaurant` (required) | `restaurantRated(Restaurant)` | Affiche nom/quartier/spécialité + `StarRating` ; relaie l'output de `StarRating` vers `RestaurantList` en reconstruisant l'objet `Restaurant` avec la nouvelle note |
| `StarRating` | `currentRating: number` | `ratingChanged(number)` | Affiche 5 étoiles (`@for` sur `[1,2,3,4,5]`), effet hover CSS, émet la note cliquée |

**Logique métier critique** : le compteur `ratedCount` ne doit augmenter **qu'au passage de `currentRating === 0` à `currentRating > 0`**. Re-noter un restaurant déjà noté change sa note mais ne doit pas re-déclencher d'incrément (c'est `computed()` sur l'état final qui garantit ça naturellement — ne pas gérer un compteur séparé à incrémenter manuellement).

---

## 7. Spécification — TP2 (couche de données)

### `MenuService` (`providedIn: 'root'`)
- `catalogue = httpResource<Plat[]>(() => environment.serverUrl + '/api/plats.json')` — lecture, expose `.value()` / `.isLoading()` / `.error()`.
- `categorieSelectionnee = signal<string>('Toutes')`.
- `platsFiltres = computed(() => ...)` — dérive de `catalogue.value()` et `categorieSelectionnee()`.
- `platDuJour = toSignal(interval(5000).pipe(map(() => ...)), { initialValue: undefined })` — tire un plat du menu, change toutes les 5s.

### `CarteComponent` (standalone)
- Injecte `MenuService` via `inject()`.
- Template gère 3 états : `catalogue.isLoading()` → message de chargement ; `catalogue.error()` → message d'erreur ; sinon → `@for` sur `platsFiltres()` avec `track plat.id`.
- Boutons de catégorie (Toutes, Plats, Grillades, Végétarien, Boissons) qui appellent `menuService.categorieSelectionnee.set(...)`.
- Prix affichés avec `{{ plat.prix | currency:'XAF':'symbol':'1.0-0' }}`.
- (Bonus) badge "épuisé" si `!plat.disponible`.

### `app.config.ts`
Ajouter `provideHttpClient()` aux providers existants.

### Environnements
```typescript
// environment.ts (base = production)
export const environment = {
  production: true,
  serverUrl: '', // à définir selon déploiement
  siteName: 'Délices de Douala',
};

// environment.development.ts
export const environment = {
  production: false,
  serverUrl: 'http://localhost:8080',
  siteName: 'Délices de Douala (dev)',
};
```

---

## 8. Grille de notation (pour prioriser le travail)

- **TP1** : 15 pts fonctionnalités obligatoires + 5 pts bonus (moyenne des notes, retrait de note, tri décroissant, filtre ≥4★, animation hover).
- **TP2** : /50 — modèle & service (8), injection & affichage (6), menu depuis serveur (12), filtre catégorie (6), plat du jour (6), environnement (6), charte ATL2026 (4), livraison Vercel (2). **Chaque pattern déprécié détecté retire 2 points.**

---

## 9. Ordre de construction recommandé

1. ✅ Setup projet + `models/restaurant.ts` (fait)
2. `StarRatingComponent` (isolé, testable seul)
3. `RestaurantCardComponent`
4. `RestaurantListComponent`
5. `HeaderComponent`
6. `App` (assemble tout, signal + computed)
7. TP2 : `models/plat.ts`, `public/api/plats.json`, `provideHttpClient()`
8. `MenuService` (signal/httpResource, filtre, plat du jour)
9. `CarteComponent`
10. Intégration dans `app.html` (les deux features sur une page)
11. Fichiers d'environnement
12. Passe CSS/responsive + bonus

---

## 10. Garde-fous pour les agents

- **Avant toute génération de code**, relire la section 3 (règles non négociables) — c'est la source de vérité, pas les habitudes par défaut du modèle.
- **Ne jamais inventer une exigence** non présente dans ce fichier (pas de nouvelle feature, pas de librairie, pas d'authentification) — si quelque chose manque, signaler la question au lieu de deviner.
- **En cas d'erreur de build/runtime** : corriger le minimum nécessaire, ne pas réécrire des fichiers non concernés par l'erreur.
- **Après toute modification** : vérifier que `ng build` passe sans erreur et qu'aucun pattern de la liste "Interdits" (§3) n'a été introduit.
- Les données imposées (§5) sont figées : ne pas les modifier, ni changer les noms de champs.
