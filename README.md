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
