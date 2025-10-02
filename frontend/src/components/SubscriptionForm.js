import React from "react";

export default function SubscriptionForm({ subscriptions, selectedIdx, onSelect, form, onChange, onSave, textInput }) {
  return (
    <div className="panel">
      <h3>Subscriptions</h3>
      <select value={selectedIdx} onChange={e => onSelect(Number(e.target.value))}>
        {subscriptions.map((s, idx) => (
          <option key={idx} value={idx}>{(s.plan || "") + " / " + (s.status || "")}</option>
        ))}
      </select>
      <div style={{ display: "grid", gap: 8, maxWidth: 420, marginTop: 12 }}>
        <input style={textInput} name="plan" value={form.plan || ""} onChange={onChange} placeholder="Plan (basic/pro/enterprise)" />
        <input style={textInput} name="status" value={form.status || ""} onChange={onChange} placeholder="Status (active/paused/canceled)" />
        <input style={textInput} name="payment_method" value={form.payment_method || ""} onChange={onChange} placeholder="Payment method" />
        <input style={textInput} name="term" value={form.term || ""} onChange={onChange} placeholder="Term (monthly/yearly)" />
        <input style={textInput} name="user_id" value={form.user_id || ""} onChange={onChange} placeholder="User ID (optional)" />
        <input style={textInput} name="company_id" value={form.company_id || ""} onChange={onChange} placeholder="Company ID (optional)" />
      </div>
      <button onClick={onSave} style={{ marginTop: 8 }}>Save subscription to DB</button>
    </div>
  );
}
