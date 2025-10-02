import React, { useEffect, useState } from "react";
import { fetchRandom, saveRandom } from "../api/randomApi";
import UserForm from "../components/UserForm";
import CompanyForm from "../components/CompanyForm";
import SubscriptionForm from "../components/SubscriptionForm";

const textInput = { padding: "8px 10px", border: "1px solid #ccc", borderRadius: 6 };

export default function RandomPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedUserIdx, setSelectedUserIdx] = useState(0);
  const [selectedCompanyIdx, setSelectedCompanyIdx] = useState(0);
  const [selectedSubIdx, setSelectedSubIdx] = useState(0);
  const [userForm, setUserForm] = useState({});
  const [companyForm, setCompanyForm] = useState({});
  const [subForm, setSubForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRandom = () => {
    setLoading(true); setError("");
    Promise.all([fetchRandom("users"), fetchRandom("companies"), fetchRandom("subscriptions")])
      .then(([u, c, s]) => {
        setUsers(u); setCompanies(c); setSubscriptions(s);
        setSelectedUserIdx(0); setSelectedCompanyIdx(0); setSelectedSubIdx(0);
      })
      .catch(e => setError(e?.message || "Failed to fetch random data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRandom(); }, []);
  useEffect(() => { setUserForm(users[selectedUserIdx] || {}); }, [selectedUserIdx, users]);
  useEffect(() => { setCompanyForm(companies[selectedCompanyIdx] || {}); }, [selectedCompanyIdx, companies]);
  useEffect(() => { setSubForm(subscriptions[selectedSubIdx] || {}); }, [selectedSubIdx, subscriptions]);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const save = async (endpoint, form) => {
    try {
      await saveRandom(endpoint, form);
      alert(`${endpoint} saved`);
    } catch(e) { alert(e.message); }
  };

  return (
    <div>
      <div className="row">
        <h2 style={{ margin: 0 }}>Random Data</h2>
        <button onClick={loadRandom} disabled={loading}>{loading ? "Loading..." : "Fetch Random Data"}</button>
      </div>
      {error && <div className="panel" style={{ background: "#7f1d1d" }}>{error}</div>}

      <UserForm users={users} selectedIdx={selectedUserIdx} onSelect={setSelectedUserIdx} form={userForm} onChange={handleChange(setUserForm)} onSave={() => save("users", userForm)} textInput={textInput} />

      <CompanyForm companies={companies} selectedIdx={selectedCompanyIdx} onSelect={setSelectedCompanyIdx} form={companyForm} onChange={handleChange(setCompanyForm)} onSave={() => save("companies", companyForm)} textInput={textInput} />

      <SubscriptionForm subscriptions={subscriptions} selectedIdx={selectedSubIdx} onSelect={setSelectedSubIdx} form={subForm} onChange={handleChange(setSubForm)} onSave={() => save("subscriptions", subForm)} textInput={textInput} />
    </div>
  );
}
