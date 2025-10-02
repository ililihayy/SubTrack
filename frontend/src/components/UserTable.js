import React from "react";

export default function UserTable({ users, onChange, onSave, onDelete, textInput }) {
  return (
    <table className="data-table" cellPadding={6} style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
      <thead>
        <tr>
          <th>ID</th><th>First</th><th>Last</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td><input style={textInput} value={u.first_name || ""} onChange={e => onChange(u.id, "first_name", e.target.value)} /></td>
            <td><input style={textInput} value={u.last_name || ""} onChange={e => onChange(u.id, "last_name", e.target.value)} /></td>
            <td><input style={textInput} value={u.email || ""} onChange={e => onChange(u.id, "email", e.target.value)} /></td>
            <td><input style={textInput} value={u.phone_number || ""} onChange={e => onChange(u.id, "phone_number", e.target.value)} /></td>
            <td><input style={textInput} value={u.address || ""} onChange={e => onChange(u.id, "address", e.target.value)} /></td>
            <td>
              <button onClick={() => onSave(u)}>Save</button>
              <button onClick={() => onDelete(u.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
