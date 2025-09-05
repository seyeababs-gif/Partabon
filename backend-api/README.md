
# BonPartage - Backend (web) - Node/Express

## Prérequis
- Node.js 18+
- npm

## Installer et lancer
cd backend-api
npm install
npm run dev
# L'API écoute sur http://localhost:4000

## Endpoints
- POST /auth/mock { email } -> { token, user }
- GET /coupons
- POST /coupons (multipart/form-data) fields: title, storeName, category, expiresAt, code, terms, ownerId, image (file)
- GET /coupons/:id
- POST /coupons/:id/claim { userId }
- DELETE /coupons/:id
