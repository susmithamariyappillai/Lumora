import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [msg, setMsg] = useState({ text: '', ok: false });
  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.message.trim().length < 10) return setMsg({ text: 'Please enter your name, a valid email and a message of at least 10 characters.', ok: false });
    setMsg({ text: 'Demo form: your message was NOT sent anywhere. Connect an email service to receive messages.', ok: true });
    setForm({ name: '', email: '', message: '' });
  };
  return (
    <div className="container auth">
      <h1>Contact us</h1>
      <form onSubmit={submit} noValidate>
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Message<textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
        {msg.text && <p className={msg.ok ? 'ok' : 'err'} role="status">{msg.text}</p>}
        <button className="btn btn-primary btn-block">Send message</button>
      </form>
    </div>
  );
}
