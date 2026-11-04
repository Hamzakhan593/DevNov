import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, CheckCircle2, LoaderCircle, Mail, Send } from 'lucide-react';
import { agency, contact } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';
import './contact.css';

const safeHttps = (value) => typeof value === 'string' && /^https:\/\/[a-z0-9.-]+(?:\:[0-9]+)?(?:[/?#][^\s]*)?$/i.test(value.trim());
const validEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const initialState = { name: '', email: '', service: '', message: '', botcheck: '' };

export default function Contact() {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);
  const feedbackRef = useRef(null);
  const requestRef = useRef(null);
  const invalidFieldRef = useRef(null);
  const key = String(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || contact.accessKey || '').trim();
  const formEnabled = /^[0-9a-f-]{30,}$/i.test(key);
  const email = validEmail(agency.email) ? agency.email.trim() : '';
  const booking = safeHttps(agency.calendlyUrl) ? agency.calendlyUrl.trim() : '';

  useEffect(() => () => { requestRef.current?.abort(); }, []);
  useEffect(() => {
    if (status === 'success' || status === 'error') feedbackRef.current?.focus({ preventScroll: true });
  }, [status]);
  useEffect(() => {
    if (!invalidFieldRef.current) return;
    formRef.current?.elements.namedItem(invalidFieldRef.current)?.focus();
    invalidFieldRef.current = null;
  }, [errors]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (status !== 'idle') { setStatus('idle'); setErrorMessage(''); }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (requestRef.current || values.botcheck) return;

    const nextErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = 'Please enter your name (at least 2 characters).';
    if (!validEmail(values.email)) nextErrors.email = 'Please enter a valid email address.';
    if (values.message.trim().length < 15) nextErrors.message = 'Please add a little more detail (at least 15 characters).';
    setErrors(nextErrors);
    setErrorMessage('');
    if (Object.keys(nextErrors).length > 0) {
      invalidFieldRef.current = Object.keys(nextErrors)[0];
      setStatus('idle');
      return;
    }
    if (!formEnabled) {
      setErrorMessage('Your message has not been sent because this form is not connected yet. Please try again later.');
      setStatus('error');
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: key,
          subject: 'New DevNov website enquiry',
          from_name: 'DevNov website',
          name: values.name.trim(),
          email: values.email.trim(),
          replyto: values.email.trim(),
          service: values.service,
          message: values.message.trim(),
          botcheck: Boolean(values.botcheck),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error('provider-rejected');
      setValues(initialState);
      setStatus('success');
    } catch {
      setErrorMessage('We could not confirm your message was sent. Your details are still here, so you can try again.');
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
    }
  };

  return (
    <section id="contact" className="dev-section dn-contact" aria-labelledby="contact-heading">
      <div className="dev-container dn-contact-layout">
        <div className="dn-contact-intro">
          <SectionHeader eyebrow="Let's work together" id="contact-heading" title="Tell us what you are building" description="Share your idea, your goals and any timing you have in mind. A short message is enough to get started." />
          {(email || booking) && <div className="dn-contact-direct">
            {email && <a href={`mailto:${email}`}><Mail size={18} aria-hidden="true" /><span>{email}</span><ArrowUpRight size={16} aria-hidden="true" /></a>}
            {booking && <a href={booking} target="_blank" rel="noopener noreferrer"><CalendarDays size={18} aria-hidden="true" /><span>Book a call</span><ArrowUpRight size={16} aria-hidden="true" /></a>}
          </div>}
          <p className="dn-contact-next">We will review your enquiry and use the email you provide to continue the conversation.</p>
        </div>

        <div className="dn-contact-form-card">
          <div className="dn-contact-form-heading"><h3>Send a message</h3><p>Tell us a little about your project</p></div>
          <form ref={formRef} onSubmit={onSubmit} className="dn-contact-form" noValidate aria-busy={status === 'sending'}>
            <div className="dn-contact-honeypot" aria-hidden="true"><label htmlFor="devnov-botcheck">Leave this field blank</label><input id="devnov-botcheck" name="botcheck" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={onChange} /></div>
            <fieldset disabled={status === 'sending'}>
              <legend className="sr-only">Your enquiry</legend>
              <div className="dn-contact-field-row">
                <div className="dn-contact-field">
                  <label htmlFor="devnov-contact-name">Your name <span aria-hidden="true">*</span></label>
                  <input id="devnov-contact-name" className="dev-input" name="name" value={values.name} onChange={onChange} required maxLength={120} autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'devnov-name-error' : undefined} />
                  {errors.name && <p className="dn-contact-field-error" id="devnov-name-error">{errors.name}</p>}
                </div>
                <div className="dn-contact-field">
                  <label htmlFor="devnov-contact-email">Your email <span aria-hidden="true">*</span></label>
                  <input id="devnov-contact-email" className="dev-input" type="email" name="email" value={values.email} onChange={onChange} required maxLength={254} autoComplete="email" placeholder="you@company.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'devnov-email-error' : undefined} />
                  {errors.email && <p className="dn-contact-field-error" id="devnov-email-error">{errors.email}</p>}
                </div>
              </div>
              <div className="dn-contact-field">
                <label htmlFor="devnov-contact-service">Project type <span className="dn-contact-optional">(optional)</span></label>
                <select id="devnov-contact-service" className="dev-input" name="service" value={values.service} onChange={onChange}><option value="">Choose a project type</option><option>Website or web app</option><option>Mobile app</option><option>Business software</option><option>AI &amp; automation</option><option>Something else</option></select>
              </div>
              <div className="dn-contact-field">
                <label htmlFor="devnov-contact-message">Your message <span aria-hidden="true">*</span></label>
                <textarea id="devnov-contact-message" className="dev-input" name="message" rows={4} minLength={15} maxLength={5000} value={values.message} onChange={onChange} required placeholder="What would you like to build or improve?" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'devnov-message-error' : undefined} />
                {errors.message && <p className="dn-contact-field-error" id="devnov-message-error">{errors.message}</p>}
              </div>
            </fieldset>
            {status === 'success' && <p ref={feedbackRef} tabIndex={-1} role="status" className="dn-contact-feedback dn-contact-feedback-success"><CheckCircle2 size={18} aria-hidden="true" /><span>Your message was submitted successfully. Thank you for getting in touch.</span></p>}
            {status === 'error' && <p ref={feedbackRef} tabIndex={-1} role="alert" className="dn-contact-feedback dn-contact-feedback-error">{errorMessage}</p>}
            <button type="submit" disabled={status === 'sending'} className="dev-primary dn-contact-submit">{status === 'sending' ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Sending…</> : <>Send message <Send size={17} aria-hidden="true" /></>}</button>
            <p className="dn-contact-form-note">Please leave out passwords, payment details and other sensitive information.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
