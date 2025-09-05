
import React, { useState } from 'react';
import { createCoupon } from '../api';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

export default function AddCoupon(){
  const [title, setTitle] = useState('');
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('Alimentaire');
  const [expiresAt, setExpiresAt] = useState('');
  const [code, setCode] = useState('');
  const [terms, setTerms] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [ocrWorking, setOcrWorking] = useState(false);
  const navigate = useNavigate();

  const onFile = (e) => {
    const f = e.target.files[0];
    setImageFile(f);
    // run OCR
    if (f) {
      setOcrWorking(true);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const { data: { text } } = await Tesseract.recognize(reader.result);
          // naive parsing: find date-like YYYY-MM-DD or DD/MM/YYYY
          const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/) || text.match(/\d{2}\/\d{2}\/\d{4}/);
          if (dateMatch) {
            let d = dateMatch[0];
            if (d.includes('/')) {
              const [dd,mm,yy] = d.split('/'); d = `${yy}-${mm}-${dd}`;
            }
            setExpiresAt(d);
          }
          // find code: word with letters/numbers 4-12 chars
          const codeMatch = text.match(/[A-Z0-9]{4,12}/i);
          if (codeMatch) setCode(codeMatch[0]);
          // try to extract store name as first line
          const lines = text.split('\n').map(s=>s.trim()).filter(Boolean);
          if (lines.length>0) setStoreName(lines[0]);
        } catch (err) {
          console.error('OCR error', err);
        } finally {
          setOcrWorking(false);
        }
      };
      reader.readAsDataURL(f);
    }
  }

  const onSave = async () => {
    if (!title || !storeName || !expiresAt) { alert('Titre, enseigne et date d\'expiration requis'); return; }
    const form = new FormData();
    form.append('title', title);
    form.append('storeName', storeName);
    form.append('category', category);
    form.append('expiresAt', expiresAt);
    form.append('code', code);
    form.append('terms', terms);
    form.append('ownerId', localStorage.getItem('userId') || 'anon');
    if (imageFile) form.append('image', imageFile);
    try {
      await createCoupon(form);
      alert('Bon ajouté !');
      navigate('/');
    } catch (e) {
      alert('Erreur : ' + e);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Ajouter un bon</h2>
        <div />
      </div>
      <div className="card">
        <label>Titre</label>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
        <label>Enseigne</label>
        <input className="input" value={storeName} onChange={e=>setStoreName(e.target.value)} />
        <label>Catégorie</label>
        <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
          <option>Alimentaire</option>
          <option>Mode</option>
          <option>High-tech</option>
          <option>Restaurant</option>
          <option>Autre</option>
        </select>
        <label>Date d'expiration (YYYY-MM-DD)</label>
        <input className="input" value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} />
        <label>Code (optionnel)</label>
        <input className="input" value={code} onChange={e=>setCode(e.target.value)} />
        <label>Conditions</label>
        <textarea className="input" value={terms} onChange={e=>setTerms(e.target.value)} />
        <label>Image du bon (optionnel) - OCR automatique</label>
        <input type="file" accept="image/*" onChange={onFile} />
        {ocrWorking && <div>OCR en cours...</div>}
        <div style={{marginTop:12}}>
          <button className="button" onClick={onSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
