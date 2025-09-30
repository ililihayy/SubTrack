import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const textInput = {
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: 6,
};

export default function DataPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [sortKey, setSortKey] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);

  const load = async () => {
    const [u, c, s] = await Promise.all([
      fetch(`${API_BASE}/users`).then(r => r.json()),
      fetch(`${API_BASE}/companies`).then(r => r.json()),
      fetch(`${API_BASE}/subscriptions`).then(r => r.json()),
    ]);
    const usersArr = Array.isArray(u) ? u : (u ? [u] : []);
    const companiesArr = Array.isArray(c) ? c : (c ? [c] : []);
    const subsArr = Array.isArray(s) ? s : (s ? [s] : []);
    setUsers(usersArr);
    setCompanies(companiesArr);
    setSubscriptions(subsArr);
  };

  useEffect(() => { load(); }, []);

  const sortedUsers = useMemo(() => {
    const base = Array.isArray(users) ? users : [];
    const arr = [...base];
    arr.sort((a, b) => {
      const va = (a?.[sortKey] || '').toString().toLowerCase();
      const vb = (b?.[sortKey] || '').toString().toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [users, sortKey, sortAsc]);

  const onUserChange = (id, field, value) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const saveUser = async (u) => {
    await fetch(`${API_BASE}/users/${u.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u)
    });
    await load();
  };

  const deleteUser = async (id) => {
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
    await load();
  };

  const sortedCompanies = useMemo(() => {
    const base = Array.isArray(companies) ? companies : [];
    const arr = [...base];
    arr.sort((a, b) => {
      const va = (a?.[sortKey] || '').toString().toLowerCase();
      const vb = (b?.[sortKey] || '').toString().toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [companies, sortKey, sortAsc]);

  const sortedSubscriptions = useMemo(() => {
    const base = Array.isArray(subscriptions) ? subscriptions : [];
    const arr = [...base];
    arr.sort((a, b) => {
      const va = (a?.[sortKey] || '').toString().toLowerCase();
      const vb = (b?.[sortKey] || '').toString().toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [subscriptions, sortKey, sortAsc]);

  const onCompanyChange = (id, field, value) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const saveCompany = async (c) => {
    await fetch(`${API_BASE}/companies/${c.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c)
    });
    await load();
  };

  const deleteCompany = async (id) => {
    await fetch(`${API_BASE}/companies/${id}`, { method: 'DELETE' });
    await load();
  };

  const onSubscriptionChange = (id, field, value) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveSubscription = async (s) => {
    await fetch(`${API_BASE}/subscriptions/${s.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s)
    });
    await load();
  };

  const deleteSubscription = async (id) => {
    await fetch(`${API_BASE}/subscriptions/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div>
      <h2>Stored Data</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label>Sort by</label>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
          <option value="id">id</option>
          <option value="first_name">first_name</option>
          <option value="last_name">last_name</option>
          <option value="email">email</option>
          <option value="business_name">business_name</option>
          <option value="industry">industry</option>
        </select>
        <button onClick={() => setSortAsc(s => !s)}>{sortAsc ? 'Asc' : 'Desc'}</button>
      </div>

      <h3 style={{ marginTop: 16 }}>Users</h3>
      <table className="data-table" cellPadding={6} style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td><input style={textInput} value={u.first_name || ''} onChange={e => onUserChange(u.id, 'first_name', e.target.value)} /></td>
              <td><input style={textInput} value={u.last_name || ''} onChange={e => onUserChange(u.id, 'last_name', e.target.value)} /></td>
              <td><input style={textInput} value={u.email || ''} onChange={e => onUserChange(u.id, 'email', e.target.value)} /></td>
              <td><input style={textInput} value={u.phone_number || ''} onChange={e => onUserChange(u.id, 'phone_number', e.target.value)} /></td>
              <td><input style={textInput} value={u.address || ''} onChange={e => onUserChange(u.id, 'address', e.target.value)} /></td>
              <td className="table-actions">
                <button onClick={() => saveUser(u)}>Save</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Subscriptions</h3>
      <table className="data-table" cellPadding={6} style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Term</th>
            <th>User ID</th>
            <th>Company ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedSubscriptions.map(s => (
            <tr key={s.id} className="sub_inputs">
              <td>{s.id}</td>
              <td><input style={textInput} value={s.plan || ''} onChange={e => onSubscriptionChange(s.id, 'plan', e.target.value)} /></td>
              <td><input style={textInput} value={s.status || ''} onChange={e => onSubscriptionChange(s.id, 'status', e.target.value)} /></td>
              <td><input style={textInput} value={s.payment_method || ''} onChange={e => onSubscriptionChange(s.id, 'payment_method', e.target.value)} /></td>
              <td><input style={textInput} value={s.term || ''} onChange={e => onSubscriptionChange(s.id, 'term', e.target.value)} /></td>
              <td><input style={textInput} value={s.user_id || ''} onChange={e => onSubscriptionChange(s.id, 'user_id', e.target.value)} /></td>
              <td><input style={textInput} value={s.company_id || ''} onChange={e => onSubscriptionChange(s.id, 'company_id', e.target.value)} /></td>
              <td className="table-actions">
                <button onClick={() => saveSubscription(s)}>Save</button>
                <button onClick={() => deleteSubscription(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Companies</h3>
      <table className="data-table" cellPadding={6} style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Industry</th>
            <th>Catch phrase</th>
            <th>Buzzword</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCompanies.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td><input style={textInput} value={c.business_name || ''} onChange={e => onCompanyChange(c.id, 'business_name', e.target.value)} /></td>
              <td><input style={textInput} value={c.industry || ''} onChange={e => onCompanyChange(c.id, 'industry', e.target.value)} /></td>
              <td><input style={textInput} value={c.catch_phrase || ''} onChange={e => onCompanyChange(c.id, 'catch_phrase', e.target.value)} /></td>
              <td><input style={textInput} value={c.buzzword || ''} onChange={e => onCompanyChange(c.id, 'buzzword', e.target.value)} /></td>
              <td><input style={textInput} value={c.address || ''} onChange={e => onCompanyChange(c.id, 'address', e.target.value)} /></td>
              <td className="table-actions">
                <button onClick={() => saveCompany(c)}>Save</button>
                <button onClick={() => deleteCompany(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


