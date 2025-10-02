import React from "react";

export default function UserForm({ users, selectedIdx, onSelect, form, onChange, onSave, textInput }) {
  const selectedUser = users[selectedIdx] || {};
  return (
    <div className="panel">
      <h3>Users</h3>
      <select value={selectedIdx} onChange={e => onSelect(Number(e.target.value))}>
        {users.map((u, idx) => (
          <option key={idx} value={idx}>{(u.first_name || "") + " " + (u.last_name || "")}</option>
        ))}
      </select>
      <div style={{ display: "grid", gap: 8, maxWidth: 420, marginTop: 12 }}>
        <input style={textInput} name="first_name" value={form.first_name || ""} onChange={onChange} placeholder="First name" />
        <input style={textInput} name="last_name" value={form.last_name || ""} onChange={onChange} placeholder="Last name" />
        <input style={textInput} name="email" value={form.email || ""} onChange={onChange} placeholder="Email" />
        <input style={textInput} name="phone_number" value={form.phone_number || ""} onChange={onChange} placeholder="Phone" />
        <input style={textInput} name="address" value={form.address || ""} onChange={onChange} placeholder="Address" />
      </div>
      <button onClick={onSave} style={{ marginTop: 8 }}>Save user to DB</button>
    </div>
  );
}
