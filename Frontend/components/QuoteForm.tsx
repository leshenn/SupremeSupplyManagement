'use client';

import { FormEvent, useState } from 'react';

type QuoteFormProps = {
  services: string[];
  quoteEmail: string;
};

export function QuoteForm({ services, quoteEmail }: QuoteFormProps) {
  const [message, setMessage] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const note = String(form.get('message') || '').trim();
    if (!name || !email || !note) {
      setMessage('Please complete your name, email and message.');
      return;
    }
    if (!quoteEmail) {
      setMessage('The contact email is not configured yet. Please try again once it has been added in WordPress.');
      return;
    }
    const subject = encodeURIComponent(`Quote request — ${name}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Company: ${form.get('company') || 'Not provided'}`,
      `Email: ${email}`,
      `Phone: ${form.get('phone') || 'Not provided'}`,
      `Service: ${form.get('service') || 'Not specified'}`,
      '',
      note,
    ].join('\n'));
    window.location.href = `mailto:${quoteEmail}?subject=${subject}&body=${body}`;
    setMessage('Your email application should open with the quote request prepared.');
  }

  return (
    <form className="quote-form" onSubmit={submit}>
      <div className="form-row">
        <label>Name<input name="name" required /></label>
        <label>Company<input name="company" /></label>
      </div>
      <div className="form-row">
        <label>Email<input type="email" name="email" required /></label>
        <label>Phone<input name="phone" /></label>
      </div>
      <label>Service
        <select name="service" defaultValue="">
          <option value="" disabled>Select a service</option>
          {services.map((service) => <option key={service}>{service}</option>)}
        </select>
      </label>
      <label>Message<textarea name="message" rows={6} required /></label>
      <button className="button" type="submit">Request a quote</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
