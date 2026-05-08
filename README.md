# CVFlow 🚀

Plateforme de carrière propulsée par l'IA — CV interactif, chatbot vocal, scanner d'offres, kanban et préparation aux entretiens.

🌐 **Production** : [cvflow.onemad.uk](https://cvflow.onemad.uk)
📄 **Exemple CV** : [cvflow.onemad.uk/mady](https://cvflow.onemad.uk/mady)
📊 **Dashboard LLMOps** : [cvflow.onemad.uk/admin](https://cvflow.onemad.uk/admin)

---

## Fonctionnalités

### CV & Chatbot IA
- **CV public interactif** — URL partageable, design moderne avec sidebar, timeline et stats
- **Chatbot IA avec RAG** — Répond aux recruteurs avec le contexte exact du CV (Ollama / Gemini / Claude)
- **Mode vocal** — 🎤 Parlez directement au chatbot, 🔊 les réponses sont lues à voix haute (Web Speech API)
- **Défense anti-injection** — 12 patterns de jailbreak bloqués automatiquement

### Outils carrière
- **Scanner d'offres** — Analyse IA avec scoring A-F et mots-clés
- **Kanban candidatures** — Suivi visuel drag & drop (Nouveau → Postulé → Entretien → Offre → Refusé)
- **CV PDF adapté** — Génération PDF personnalisé par offre
- **Préparation entretiens** — Questions IA + évaluation des réponses STAR

### LLMOps Dashboard (/admin)
- **Overview** — KPIs temps réel, activité 30j, providers IA, index RAG
- **Conversations** — Historique complet avec latences et filtres
- **Sécurité** — Patterns de jailbreak, historique des tentatives

### Qualité
- **15 evals automatisés** — Factual, Persona, Sécurité, Qualité, Langue
- **100% de réussite** sur tous les profils testés
- **Certifications & Photo** — Badge et photo de profil
- **Responsive** — Compatible mobile, tablette et desktop

---

## Stack technique

### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS
- Zustand (state management)
- React Router v6
- Web Speech API (vocal)

### Backend
- Node.js + Express + TypeScript
- Prisma v7 + PostgreSQL
- JWT Authentication
- RAG avec embeddings Ollama (nomic-embed-text)

### IA
- Ollama (local) — qwen2.5:14b
- Google Gemini API
- Anthropic Claude API

### Infrastructure
- Kubernetes K3s (3 noeuds)
- ArgoCD (GitOps)
- Cloudflare Tunnel
- Tailscale (réseau privé)

---

## Pages

| Route | Description |
|-------|-------------|
| / | Landing page |
| /register | Inscription |
| /:username | CV public + chatbot vocal |
| /dashboard | Dashboard utilisateur |
| /dashboard/cv | Editeur CV |
| /dashboard/ai | Config IA (provider, modèle, prompt) |
| /dashboard/jobs | Scanner d'offres |
| /dashboard/kanban | Kanban candidatures |
| /dashboard/interview | Préparation entretiens |
| /admin | Dashboard LLMOps |

---



## Architecture

### Vue d'ensemble

\`\`\`
Recruteurs / Candidats / Admin
           |
    Cloudflare Tunnel (HTTPS)
    cvflow.onemad.uk
           |
+------------------------------------------+
|  Cluster K3s (master01/02 + worker01)    |
|                                          |
|  +------------------+  +--------------+ |
|  | Frontend React   |  | Features     | |
|  | Vite · TS        |  | Web Speech   | |
|  | /dashboard/*     |  | Chatbot RAG  | |
|  | /admin · /       |  | Career Pipe  | |
|  +--------+---------+  +--------------+ |
|           |                             |
|  +--------v--------------------------+  |
|  |   Backend Node.js + Express       |  |
|  |  /api/auth  /api/cv  /api/chat    |  |
|  |  /api/jobs  /api/admin            |  |
|  |  /api/scraper (cron 6h - Adzuna)  |  |
|  |  RAG agéntic · Jailbreak defense  |  |
|  +-----+----------+-------------+---+  |
|        |          |             |       |
|  +-----v--+ +-----v----+ +-----v-----+ |
|  |  PG DB | | Ollama   | | Externes  | |
|  |  2Gi   | | Mac Mini | | Adzuna    | |
|  | ChatLog| | qwen2.5  | | Gemini    | |
|  | CVChunk| | nomic-   | | Claude    | |
|  |JobScrap| | embed    | | API       | |
|  +--------+ +----------+ +-----------+ |
+------------------------------------------+
        |           |            |
  Registry K8s  ArgoCD GitOps  GitHub/Gitea
  Gitea NAS     onemadlab      Code source
\`\`\`

### Pipeline RAG

\`\`\`
CV utilisateur
     |
     v
Découpage en 7 types de chunks
(summary, contact, experiences,
 education, skills, languages, certifications)
     |
     v
Embeddings Ollama (nomic-embed-text) --> CVChunk (PostgreSQL JSONB)

-- A chaque message recruteur --
Message --> Embedding requete --> Similarite cosinus vs tous les chunks
     |
     v
Top 3 chunks pertinents --> Injection system prompt
     |
     v
Modele IA (Ollama / Gemini / Claude) --> Reponse
     |
     v
ChatLog (latence, provider, jailbreak)
\`\`\`

### Défense anti-injection

\`\`\`
Message entrant
     |
     v
12 patterns regex detectes
(ignore instructions, jailbreak, system prompt, DAN mode...)
     |
  +--+--+
  |     |
Bloque  OK --> Pipeline RAG normal
  |
  v
ChatLog (is_jailbreak=true) + reponse neutre
\`\`\`

## Installation locale

```bash
git clone https://github.com/RonoaMad1/cvflow
cd cvflow
npm install
cp .env.example .env
npm run dev
```

---

## Profils de démonstration

| Profil | URL | Poste |
|--------|-----|-------|
| Mady NIAKATE | cvflow.onemad.uk/mady | Administrateur Système & DevOps |
| Isaac LOORIUS | cvflow.onemad.uk/isaac-loorius | Administrateur Système & Réseaux |

---

## Auteur

**Mady NIAKATE** — Administrateur Système & DevOps
- CV : [cvflow.onemad.uk/mady](https://cvflow.onemad.uk/mady)
- GitHub : [github.com/RonoaMad1](https://github.com/RonoaMad1)

---

*CVFlow — Votre carrière, propulsée par l'IA* 🚀
