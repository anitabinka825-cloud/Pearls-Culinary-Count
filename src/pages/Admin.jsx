import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Alert, Spinner } from '../components/ui.jsx';

export default function Admin() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listUsers().then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <Alert>{error}</Alert>
      {!data && !error && <Spinner className="h-6 w-6" />}
      {data && (
        <div className="card overflow-x-auto !p-0">
          <p className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{data.total} user(s)</p>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Email</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Verified</th><th className="px-4 py-2">Joined</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2">{u.name || '-'}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">{u.emailVerified ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
