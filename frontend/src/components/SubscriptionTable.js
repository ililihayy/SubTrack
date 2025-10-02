import React from "react";

export default function SubscriptionTable({ subscriptions, onChange, onSave, onDelete, textInput }) {
  return (
    <table className="data-table" cellPadding={6} style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
      <thead>
        <tr>
          <th>ID</th><th>Plan</th><th>Status</th><th>Payment</th><th>Term</th><th>User ID</th><th>Company ID</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {subscriptions.map(s => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td><input style={textInput} value={s.plan || ""} onChange={e => onChange(s.id, "plan", e.target.value)} /></td>
            <td><input style={textInput} value={s.status || ""} onChange={e => onChange(s.id, "status", e.target.value)} /></td>
            <td><input style={textInput} value={s.payment_method || ""} onChange={e => onChange(s.id, "payment_method", e.target.value)} /></td>
            <td><input style={textInput} value={s.term || ""} onChange={e => onChange(s.id, "term", e.target.value)} /></td>
            <td><input style={textInput} value={s.user_id || ""} onChange={e => onChange(s.id, "user_id", e.target.value)} /></td>
            <td><input style={textInput} value={s.company_id || ""} onChange={e => onChange(s.id, "company_id", e.target.value)} /></td>
            <td>
              <button onClick={() => onSave(s)}>Save</button>
              <button onClick={() => onDelete(s.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
