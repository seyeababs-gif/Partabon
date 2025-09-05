
import React, { useEffect, useState } from 'react';
import { getCoupon, claimCoupon } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function CouponDetail(){
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getCoupon(id);
      setCoupon(data);
    } catch (e) {
      alert('Erreur: ' + e);
    }
  }
  useEffect(()=>{ load(); }, [id]);

  const onClaim = async () => {
    try {
      await claimCoupon(id, localStorage.getItem('userId') || 'anon');
      alert('Bon réservé pour toi.');
      load();
    } catch (e) {
      alert('Erreur: ' + e);
    }
  }

  if (!coupon) return <div className="container"><div>Chargement...</div></div>;

  return (
    <div className="container">
      <div className="header">
        <h2>Détail du bon</h2>
        <div>
          <button className="button" onClick={()=>navigate(-1)}>Retour</button>
        </div>
      </div>
      <div className="card">
        <h3>{coupon.title}</h3>
        <div><strong>Enseigne:</strong> {coupon.storeName}</div>
        <div><strong>Expire le:</strong> {coupon.expiresAt}</div>
        {coupon.code && <div><strong>Code:</strong> {coupon.code}</div>}
        {coupon.terms && <div style={{marginTop:8}}>{coupon.terms}</div>}
        {coupon.imageUrl && <img className="preview" src={(import.meta.env.VITE_API_URL || 'http://localhost:4000') + coupon.imageUrl} alt="coupon" />}
        <div style={{marginTop:12}}>
          <button className="button" onClick={onClaim} disabled={!!coupon.claimedBy}>Réserver ce bon</button>
          {coupon.claimedBy ? <div style={{marginTop:8, fontStyle:'italic'}}>Ce bon a été réservé.</div> : null}
        </div>
      </div>
    </div>
  )
}
