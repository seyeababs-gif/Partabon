
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function loginMock(email){
  const res = await axios.post(API_URL + '/auth/mock', { email });
  return res.data;
}
export async function listCoupons(){
  const res = await axios.get(API_URL + '/coupons');
  return res.data;
}
export async function createCoupon(formData){
  const res = await axios.post(API_URL + '/coupons', formData, { headers: {'Content-Type':'multipart/form-data'} });
  return res.data;
}
export async function getCoupon(id){
  const res = await axios.get(API_URL + '/coupons/' + id);
  return res.data;
}
export async function claimCoupon(id, userId){
  const res = await axios.post(API_URL + '/coupons/' + id + '/claim', { userId });
  return res.data;
}
