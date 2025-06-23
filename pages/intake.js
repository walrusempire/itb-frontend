import { useState } from 'react';

export default function IntakeForm() {
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    website: '',
    kics: [],
    company_summary: '',
    rd_capability: '',
    export_markets: '',
    ip_strategy: '',
    certifications: '',
    indigenous_affiliation: '',
    skills_development: '',
  });

  const [aiSuggestions, setAiSuggestions] = useState({});
  const [status, setStatus] = useState('');
  const [file, setFile] = useState(null);

  const KIC_OPTIONS = [
    "Aerospace",
    "Defence",
    "Security",
    "Marine",
    "Space",
    "Cyber",
    "Artificial Intelligence",
    "Clean Technology",
    "Advanced Manufacturing",
    "Quantum",
    "Other"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleKIC = (value) => {
    setForm((prev) => ({
      ...prev,
      kics: prev.kics.includes(value)
        ? prev.kics.filter((k) => k !== value)
        : [...prev.kics, value]
    }));
  };

  const getAISuggestion = async (field) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai_suggest?company_id=1&field=${field}`);
    const data = await res.json();
    setAiSuggestions({ ...aiSuggestions, [field]: data.suggestion });
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    return res.ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileUploaded = await handleFileUpload();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/1/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? 'Form submitted successfully!' : 'Error submitting form.');
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
      <h1>ITB Intake Form</h1>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Company Name', name: 'company_name' },
          { label: 'Contact Name', name: 'contact_name' },
          { label: 'Contact Email', name: 'contact_email' },
          { label: 'Website', name: 'website' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label>{label}</label>
            <input type="text" name={name} value={form[name]} onChange={handleChange} style={{ width: '100%' }} required />
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <label>KIC Areas (Select all that apply):</label><br />
          {KIC_OPTIONS.map((kic) => (
            <label key={kic} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={form.kics.includes(kic)}
                onChange={() => toggleKIC(kic)}
              /> {kic}
            </label>
          ))}
        </div>

        {[
          { label: 'Company Summary', name: 'company_summary' },
          { label: 'R&D Capability', name: 'rd_capability' },
          { label: 'Export Markets', name: 'export_markets' },
          { label: 'IP Strategy', name: 'ip_strategy' },
          { label: 'Certifications', name: 'certifications' },
          { label: 'Indigenous Affiliation', name: 'indigenous_affiliation' },
          { label: 'Skills Development Plan', name: 'skills_development' },
        ].map(({ label, name }) => (
          <div key={name} style={{ marginTop: 20 }}>
            <label>{label}</label>
            <textarea rows={4} name={name} value={form[name]} onChange={handleChange} style={{ width: '100%' }} />
            <div>
              <button type="button" onClick={() => getAISuggestion(name)}>Help Write with AI</button>
              {aiSuggestions[name] && (
                <div style={{ background: "#eee", padding: 10, marginTop: 5 }}>
                  <em>AI Suggestion:</em>
                  <p>{aiSuggestions[name]}</p>
                  <button type="button" onClick={() => setForm({ ...form, [name]: aiSuggestions[name] })}>
                    Use Suggestion
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <label>Upload Supporting Document:</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button type="submit" style={{ marginTop: 20 }}>Submit Form</button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}
