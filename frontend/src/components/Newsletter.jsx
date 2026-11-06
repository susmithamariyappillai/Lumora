import { useState } from 'react';

export default function Newsletter() {

const [email, setEmail] = useState('');

const [msg, setMsg] = useState({ text: '', ok: false });

const submit = (e) => {

    // Prevents the page from reloading.
    e.preventDefault();

    // Checks whether the email format is valid.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setMsg({
        text: 'Please enter a valid email address.',
        ok: false
      });
    }

    // Displays success message.
    // No email service is connected.
    setMsg({
      text: 'Thank you for subscribing! Welcome to the Lumora community.',
      ok: true
    });

    // Clears the email input.
    setEmail('');
  };

  return (
    <section className="newsletter">
      <div>
        <h2>Join Our Newsletter</h2>
        <p>Get exclusive offers, style tips and more.</p>
      </div>

      <form onSubmit={submit} noValidate>
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>

        <input
          id="nl-email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-pink" type="submit">
          Subscribe Now
        </button>

        {/* Displays message only when msg.text has a value. */}
        {msg.text && (
          <p className={msg.ok ? 'ok' : 'err'} role="status">
            {msg.text}
          </p>
        )}
      </form>
    </section>
  );
}