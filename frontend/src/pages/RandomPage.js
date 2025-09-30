import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const textInput = {
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: 6,
};

const section = { marginBottom: 24 };

export default function RandomPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedUserIdx, setSelectedUserIdx] = useState(0);
  const [selectedCompanyIdx, setSelectedCompanyIdx] = useState(0);
  const [selectedSubIdx, setSelectedSubIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedUser = users[selectedUserIdx] || {};
  const selectedCompany = companies[selectedCompanyIdx] || {};

  const loadRandom = () => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`${API_BASE}/random/users?size=10`).then(async r => { if (!r.ok) throw new Error(`Users fetch failed: ${r.status}`); return r.json(); }),
      fetch(`${API_BASE}/random/companies?size=10`).then(async r => { if (!r.ok) throw new Error(`Companies fetch failed: ${r.status}`); return r.json(); }),
      fetch(`${API_BASE}/random/subscriptions?size=10`).then(async r => { if (!r.ok) throw new Error(`Subscriptions fetch failed: ${r.status}`); return r.json(); }),
    ])
      .then(([u, c, s]) => {
        const usersArr = Array.isArray(u) ? u : (u ? [u] : []);
        const companiesArr = Array.isArray(c) ? c : (c ? [c] : []);
        const subsArr = Array.isArray(s) ? s : (s ? [s] : []);
        setUsers(usersArr);
        setCompanies(companiesArr);
        setSubscriptions(subsArr);
        setSelectedUserIdx(0);
        setSelectedCompanyIdx(0);
        setSelectedSubIdx(0);
      })
      .catch((e) => {
        console.error(e);
        setError(e?.message || "Failed to fetch random data.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRandom(); }, []);

  const [userForm, setUserForm] = useState({});
  const [companyForm, setCompanyForm] = useState({});
  const [subForm, setSubForm] = useState({});

  useEffect(() => {
    if (!selectedUser) return;
    setUserForm({ ...selectedUser });
  }, [selectedUserIdx, users]);

  useEffect(() => {
    if (!selectedCompany) return;
    setCompanyForm({ ...selectedCompany });
  }, [selectedCompanyIdx, companies]);

  useEffect(() => {
    const sel = subscriptions[selectedSubIdx] || {};
    setSubForm({ ...sel });
  }, [selectedSubIdx, subscriptions]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubChange = (e) => {
    const { name, value } = e.target;
    setSubForm(prev => ({ ...prev, [name]: value }));
  };

  const saveUser = async () => {
    const res = await fetch(`${API_BASE}/random/users/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
    });
    await res.json();
    alert('User saved');
  };

  const saveCompany = async () => {
    const res = await fetch(`${API_BASE}/random/companies/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyForm),
    });
    await res.json();
    alert('Company saved');
  };

  const saveSubscription = async () => {
    const payload = { ...subForm };
  
    if (payload.user_id) payload.user_id = Number(payload.user_id);
    if (payload.company_id) payload.company_id = Number(payload.company_id);
    const res = await fetch(`${API_BASE}/random/subscriptions/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (!res.ok) {
      alert(j?.detail || 'Failed to save subscription');
      return;
    }
    alert('Subscription saved');
  };

  return (
    <div>
      <div className="row">
        <h2 style={{ margin: 0 }}>Random Data</h2>
        <button onClick={loadRandom} disabled={loading}>{loading ? 'Loading...' : 'Fetch Random Data'}</button>
      </div>
      {error ? (
        <div className="panel" style={{ background: '#7f1d1d' }}>
          {error}
        </div>
      ) : null}

      <div className="spacer" />
      <div className="panel">
        <h3>Users</h3>
        <select value={selectedUserIdx} onChange={e => setSelectedUserIdx(Number(e.target.value))}>
          {(Array.isArray(users) ? users : []).map((u, idx) => (
            <option key={idx} value={idx}>
              {(u.first_name || '') + ' ' + (u.last_name || '')}
            </option>
          ))}
        </select>

        <div style={{ display: 'grid', gap: 8, maxWidth: 420, marginTop: 12 }}>
          <input style={textInput} name="first_name" value={userForm.first_name || ''} onChange={handleUserChange} placeholder="First name" />
          <input style={textInput} name="last_name" value={userForm.last_name || ''} onChange={handleUserChange} placeholder="Last name" />
          <input style={textInput} name="email" value={userForm.email || ''} onChange={handleUserChange} placeholder="Email" />
          <input style={textInput} name="phone_number" value={userForm.phone_number || ''} onChange={handleUserChange} placeholder="Phone" />
          <input style={textInput} name="address" value={userForm.address || ''} onChange={handleUserChange} placeholder="Address" />
        </div>
        <button onClick={saveUser} style={{ marginTop: 8 }}>Save user to DB</button>
      </div>

      <div className="spacer" />
      <div className="panel">
        <h3>Companies</h3>
        <select value={selectedCompanyIdx} onChange={e => setSelectedCompanyIdx(Number(e.target.value))}>
          {(Array.isArray(companies) ? companies : []).map((c, idx) => (
            <option key={idx} value={idx}>
              {c.business_name || c.business}
            </option>
          ))}
        </select>

        <div style={{ display: 'grid', gap: 8, maxWidth: 420, marginTop: 12 }}>
          <input style={textInput} name="business_name" value={companyForm.business_name || companyForm.business || ''} onChange={handleCompanyChange} placeholder="Business name" />
          <input style={textInput} name="industry" value={companyForm.industry || ''} onChange={handleCompanyChange} placeholder="Industry" />
          <input style={textInput} name="catch_phrase" value={companyForm.catch_phrase || ''} onChange={handleCompanyChange} placeholder="Catch phrase" />
          <input style={textInput} name="buzzword" value={companyForm.buzzword || ''} onChange={handleCompanyChange} placeholder="Buzzword" />
          <input style={textInput} name="address" value={companyForm.address || ''} onChange={handleCompanyChange} placeholder="Address" />
        </div>
        <button onClick={saveCompany} style={{ marginTop: 8 }}>Save company to DB</button>
      </div>

      <div className="spacer" />
      <div className="panel">
        <h3>Subscriptions</h3>
        <select value={selectedSubIdx} onChange={e => setSelectedSubIdx(Number(e.target.value))}>
          {(Array.isArray(subscriptions) ? subscriptions : []).map((s, idx) => (
            <option key={idx} value={idx}>
              {(s.plan || '') + ' / ' + (s.status || '')}
            </option>
          ))}
        </select>

        <div style={{ display: 'grid', gap: 8, maxWidth: 420, marginTop: 12 }}>
          <input style={textInput} name="plan" value={subForm.plan || ''} onChange={handleSubChange} placeholder="Plan (basic/pro/enterprise)" />
          <input style={textInput} name="status" value={subForm.status || ''} onChange={handleSubChange} placeholder="Status (active/paused/canceled)" />
          <input style={textInput} name="payment_method" value={subForm.payment_method || ''} onChange={handleSubChange} placeholder="Payment method" />
          <input style={textInput} name="term" value={subForm.term || ''} onChange={handleSubChange} placeholder="Term (monthly/yearly)" />
          <input style={textInput} name="user_id" value={subForm.user_id || ''} onChange={handleSubChange} placeholder="User ID (optional)" />
          <input style={textInput} name="company_id" value={subForm.company_id || ''} onChange={handleSubChange} placeholder="Company ID (optional)" />
        </div>
        <button onClick={saveSubscription} style={{ marginTop: 8 }}>Save subscription to DB</button>
      </div>
    </div>
  );
}


