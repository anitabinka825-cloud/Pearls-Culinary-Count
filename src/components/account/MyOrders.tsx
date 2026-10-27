import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, Order } from '../../services/api';
import { formatPesewas } from '../../lib/purchasable';
import { ORDER_STATUS_LABEL } from '../cart/OrderView';

export function MyOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    getMyOrders().then(setOrders).catch((e) => setError(e.message));
  }, []);
  const box = 'bg-white rounded-2xl border border-neutral-200/80 p-8 text-sm';
  if (error) return <p className={`${box} text-red-600`}>{error}</p>;
  if (!orders) return <p className={`${box} text-neutral-500`}>Loading your orders…</p>;
  if (orders.length === 0)
    return (
      <div className={`${box} text-center space-y-3`}>
        <p className="font-bold text-neutral-900">No orders yet</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 rounded-full bg-[#DE1B76] text-white text-sm font-semibold">Start shopping</Link>
      </div>
    );
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link to={`/order/${o.reference}`} className="block bg-white rounded-2xl border border-neutral-200/80 p-5 hover:border-[#DE1B76]/40">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-sm text-neutral-900">{o.reference}</span>
              <span className="px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#DE1B76] text-[11px] font-semibold">{ORDER_STATUS_LABEL[o.status]}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{new Date(o.createdAt).toLocaleDateString()} · {formatPesewas(o.totalPesewas)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
