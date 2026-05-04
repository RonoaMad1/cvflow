# CVFlow 🚀

Plateforme de carrière alimentée par l'IA — CV interactif, scanner d'offres, kanban candidatures et préparation aux entretiens.

🌐 **Production** : [cvflow.onemad.uk](https://cvflow.onemad.uk)
📄 **Exemple CV** : [cvflow.onemad.uk/mady](https://cvflow.onemad.uk/mady)

---

## Fonctionnalités

- **CV public interactif** — URL partageable, design moderne avec sidebar, timeline et stats
- **Chatbot IA** — Assistant qui répond aux recruteurs 24h/24 (Ollama / Gemini / Claude)
- **Scanner d'offres** — Analyse IA avec scoring A-F et mots-clés
- **Kanban candidatures** — Suivi visuel drag & drop (Nouveau → Postulé → Entretien → Offre → Refusé)
- **CV PDF adapté** — Génération PDF personnalisé par offre avec mots-clés injectés
- **Préparation entretiens** — Questions IA + évaluation des réponses STAR
- **Certifications & Photo** — Ajout de certifications avec badge et photo de profil
- **Responsive** — Compatible mobile, tablette et desktop

---

## Stack technique

### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS
- Zustand (state management)
- React Router v6
- Axios

### Backend
- Node.js + Express + TypeScript
- Prisma v7 + PostgreSQL
- JWT Authentication

### IA
- Ollama (local) — qwen2.5:14b, qwen3.6:27b
- Google Gemini API
- Anthropic Claude API

### Infrastructure
- Kubernetes K3s (3 nœuds)
- ArgoCD (GitOps)
- Cloudflare Tunnel
- Tailscale (réseau privé)

---

## Architecture
---

## Installation locale

### Prérequis
- Node.js 18+
- PostgreSQL
- Ollama (optionnel)

### Frontend
```bash
git clone https://github.com/RonoaMad1/cvflow
cd cvflow
npm install
cp .env.example .env
npm run dev
```

### Backend
```bash
git clone https://github.com/RonoaMad1/cvflow-api
cd cvflow-api
npm install
cp .env.example .env
npm run dev
```

### Variables d'environnement Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cvflow
JWT_SECRET=votre-secret
OLLAMA_URL=http://localhost:11434
GEMINI_API_KEY=votre-cle-gemini
ANTHROPIC_API_KEY=votre-cle-anthropic
```

---

## Structure base de données

```sql
User        — id, email, password, username
CV          — id, userId, firstName, lastName, title, summary,
              email, phone, location, linkedin, github, website,
              experiences, education, skills, languages,
              certifications, photo,
              aiProvider, aiModel, systemPrompt, isPublic
Job         — id, userId, url, title, company, description,
              score, grade, analysis, status, createdAt
```

---

## Déploiement K8s

```bash
# Build et push image
nerdctl build --no-cache -t registry:32000/cvflow:vX .
nerdctl push registry:32000/cvflow:vX --insecure-registry

# Déployer
kubectl set image deployment/cvflow cvflow=registry:32000/cvflow:vX -n cvflow
```

---

## Modèles IA recommandés

| Usage | Modèle | Raison |
|-------|--------|--------|
| Chatbot | qwen2.5:14b | Rapide, bon français |
| Scanner offres | qwen2.5:14b | JSON structuré fiable |
| Prépa entretiens | qwen2.5:14b | Bon raisonnement |
| Alternative cloud | gemini-2.0-flash | Très rapide, gratuit |

---

## Auteur

**Mady NIAKATE** — Administrateur Système & DevOps
- CV : [cvflow.onemad.uk/mady](https://cvflow.onemad.uk/mady)
- GitHub : [github.com/RonoaMad1](https://github.com/RonoaMad1)

---

*CVFlow — Votre carrière, propulsée par l'IA* 🚀
