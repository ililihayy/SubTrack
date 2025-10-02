import React from "react";

export default function CompanyForm({ companies, selectedIdx, onSelect, form, onChange, onSave, textInput }) {
  return (
    <div className="panel">
      <h3>Companies</h3>
      <select value={selectedIdx} onChange={e => onSelect(Number(e.target.value))}>
        {companies.map((c, idx) => (
          <option key={idx} value={idx}>{c.business_name || c.business}</option>
        ))}
      </select>
      <div style={{ display: "grid", gap: 8, maxWidth: 420, marginTop: 12 }}>
        <input style={textInput} name="business_name" value={form.business_name || form.business || ""} onChange={onChange} placeholder="Business name" />
        <input style={textInput} name="industry" value={form.industry || ""} onChange={onChange} placeholder="Industry" />
        <input style={textInput} name="catch_phrase" value={form.catch_phrase || ""} onChange={onChange} placeholder="Catch phrase" />
        <input style={textInput} name="buzzword" value={form.buzzword || ""} onChange={onChange} placeholder="Buzzword" />
        <input style={textInput} name="address" value={form.address || ""} onChange={onChange} placeholder="Address" />
      </div>
      <button onClick={onSave} style={{ marginTop: 8 }}>Save company to DB</button>
    </div>
  );
}
