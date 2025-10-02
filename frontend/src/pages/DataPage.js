import React, { useEffect, useState, useMemo } from "react";
import { fetchData, patchData, deleteData } from "../api/randomApi";
import UserTable from "../components/UserTable";
import CompanyTable from "../components/CompanyTable";
import SubscriptionTable from "../components/SubscriptionTable";

const textInput = { padding: "8px 10px", border: "1px solid #ccc", borderRadius: 6 };

export default function DataPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [sortKey, setSortKey] = useState("id");
  const [sortAsc, setSortAsc] = useState(true);

  const load = async () => {
    setUsers(await fetchData("users"));
    setCompanies(await fetchData("companies"));
    setSubscriptions(await fetchData("subscriptions"));
  };

  useEffect(() => { load(); }, []);

  const sortArray = (arr) => [...arr].sort((a,b)=>{
    const va = (a?.[sortKey] || "").toString().toLowerCase();
    const vb = (b?.[sortKey] || "").toString().toLowerCase();
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const sortedUsers = useMemo(() => sortArray(users), [users, sortKey, sortAsc]);
  const sortedCompanies = useMemo(() => sortArray(companies), [companies, sortKey, sortAsc]);
  const sortedSubscriptions = useMemo(() => sortArray(subscriptions), [subscriptions, sortKey, sortAsc]);

  const onUserChange = (id, field, value) => setUsers(prev => prev.map(u => u.id===id ? {...u, [field]: value} : u));
  const saveUser = async (u) => { await patchData("users", u.id, u); await load(); };
  const deleteUserById = async (id) => { await deleteData("users", id); await load(); };

  const onCompanyChange = (id, field, value) => setCompanies(prev => prev.map(c => c.id===id ? {...c, [field]: value} : c));
  const saveCompany = async (c) => { await patchData("companies", c.id, c); await load(); };
  const deleteCompanyById = async (id) => { await deleteData("companies", id); await load(); };

  const onSubscriptionChange = (id, field, value) => setSubscriptions(prev => prev.map(s => s.id===id ? {...s, [field]: value} : s));
  const saveSubscription = async (s) => { await patchData("subscriptions", s.id, s); await load(); };
  const deleteSubscriptionById = async (id) => { await deleteData("subscriptions", id); await load(); };

  return (
    <div>
      <h2>Stored Data</h2>
      <div>
        <label>Sort by</label>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
          <option value="id">id</option>
          <option value="first_name">first_name</option>
          <option value="last_name">last_name</option>
          <option value="email">email</option>
          <option value="business_name">business_name</option>
          <option value="industry">industry</option>
        </select>
        <button onClick={() => setSortAsc(a=>!a)}>{sortAsc ? "Asc" : "Desc"}</button>
      </div>

      <h3>Users</h3>
      <UserTable users={sortedUsers} onChange={onUserChange} onSave={saveUser} onDelete={deleteUserById} textInput={textInput} />

      <h3>Companies</h3>
      <CompanyTable companies={sortedCompanies} onChange={onCompanyChange} onSave={saveCompany} onDelete={deleteCompanyById} textInput={textInput} />

      <h3>Subscriptions</h3>
      <SubscriptionTable subscriptions={sortedSubscriptions} onChange={onSubscriptionChange} onSave={saveSubscription} onDelete={deleteSubscriptionById} textInput={textInput} />
    </div>
  );
}
