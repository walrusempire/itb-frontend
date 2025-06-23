import { useState } from 'react';

export default function IntakeForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    summary: '',
    rAndD: '',
    exportStrategy: '',
    skillsDevelopment: '',
    ipStrategy: '',
  });

  const [aiSuggestions, setAiSuggestions] = useState({});
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getAISuggestion = async (field) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai_suggest?company_id=1&field=${field}`);
    const data = await res.json();
    setAiSuggestions({ ...aiSuggestions, [field]: data.suggestion });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/1/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setStatus(res.ok ? 'Submitted successfully!' : 'Error submitting.');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>ITB Intake Form</h1>
      <form onSubmit={handleSubmit}>
        {['companyName', 'summary', 'rAndD', 'exportStrategy', 'skillsDevelopment', 'ipStrategy'].map((field) => (
          <div key={field} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>{field}</label>
            <textarea
              rows={4}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
            {aiSuggestions[field] && (
              <div style={{ background: '#eee', padding: 10, marginTop: 5 }}>
                <em>AI Suggestion:</em>
                <p>{aiSuggestions[field]}</p>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, [field]: aiSuggestions[field] })}
                >
                  Use Suggestion
                </button>
              </div>
            )}
            <button type="button" onClick={() => getAISuggestion(field)}>
              Help Write with AI
            </button>
          </div>
        ))}
        <button type="submit">Submit Form</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
