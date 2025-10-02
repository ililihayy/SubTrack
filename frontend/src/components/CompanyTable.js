import React from "react";

export default function CompanyTable({ companies, onChange, onSave, onDelete, textInput }) {
  return (
    <table className="data-table" cellPadding={6} style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Industry</th><th>Catch phrase</th><th>Buzzword</th><th>Address</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {companies.map(c => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td><input style={textInput} value={c.business_name || ""} onChange={e => onChange(c.id, "business_name", e.target.value)} /></td>
            <td><input style={textInput} value={c.industry || ""} onChange={e => onChange(c.id, "industry", e.target.value)} /></td>
            <td><input style={textInput} value={c.catch_phrase || ""} onChange={e => onChange(c.id, "catch_phrase", e.target.value)} /></td>
            <td><input style={textInput} value={c.buzzword || ""} onChange={e => onChange(c.id, "buzzword", e.target.value)} /></td>
            <td><input style={textInput} value={c.address || ""} onChange={e => onChange(c.id, "address", e.target.value)} /></td>
            <td>
              <button onClick={() => onSave(c)}>Save</button>
              <button onClick={() => onDelete(c.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
