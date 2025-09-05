
import React, { useEffect, useState } from 'react';
import { listCoupons } from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function Home(){
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await listCoupons();
      setCoupons(data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }
  useEffect(()=>{ load(); }, []);

  return (
    <div className="container">
      <div className="header">
        <h2>Bons disponibles</h2>
        <div>
          <Link to="/add" className="button" style={{marginRight:8}}>Ajouter un bon</Link>
          <button className="button" onClick={()=>{ localStorage.clear(); navigate('/login'); }}>Déconnexion</button>
        </div>
      </div>

      {loading && <div>Chargement...</div>}
      {coupons.length === 0 && <div>Aucun bon pour le moment.</div>}
      {coupons.map(c => (
        <div className="card" key={c.id}>
          <h3>{c.title}</h3>
          <div><strong>Enseigne :</strong> {c.storeName} {c.code ? <span> - Code: {c.code}</span> : null}</div>
          <div><strong>Expire le :</strong> {c.expiresAt}</div>
          <div><strong>Catégorie :</strong> {c.category}</div>
          {c.imageUrl && <img className="preview" src={(import.meta.env.VITE_API_URL || 'http://localhost:4000') + c.imageUrl} alt="coupon" />}
          <div style={{marginTop:8}}>
            <Link to={'/coupon/' + c.id} className="button">Voir</Link>
          </div>
        </div>
      ))}
    </div>
  )
}
