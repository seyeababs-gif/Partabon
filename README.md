
# BonPartage - Full Web Version (Beta)

Ce projet contient:
- backend-api: Node.js + Express backend (image upload saved in /public/uploads)
- web-frontend: React + Vite frontend (uses Tesseract.js for OCR in browser)

Instructions:
1) Start backend:
   cd backend-api
   npm install
   npm run dev

2) Start frontend (in another terminal):
   cd web-frontend
   npm install
   npm run dev

3) Open frontend in browser (http://localhost:5173), login with any email, test add/list/claim.

Notes:
- Images uploaded are stored in backend-api/public/uploads and served at /uploads/...
- OCR runs in the browser via Tesseract.js to prefill some fields when you upload an image on the "Add" page.
