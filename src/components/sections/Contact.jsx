import { useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, Mail, MessageSquareText, Send, ShieldCheck } from 'lucide-react';
import { agency, contact } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';

const safeHttps = (value) => typeof value === 'string' && /^https:\/\/[a-z0-9.-]+(?:\:[0-9]+)?(?:[/?#][^\s]*)?$/i.test(value.trim());
const validEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const initialState = { name: '', email: '', service: '', message: '', company: '', botcheck: '' };

export default function Contact() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const key = String(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || contact.accessKey || '').trim();
  const formEnabled = /^[0-9a-f-]{30,}$/i.test(key);
  const email = validEmail(agency.email) ? agency.email.trim() : '';
  const booking = safeHttps(agency.calendlyUrl) ? agency.calendlyUrl.trim() : '';
  const canContact = formEnabled || Boolean(email) || Boolean(booking);

  const onChange = (event) => { setValues((current) => ({...current, [event.target.name]: event.target.value})); if (status !== 'idle') setStatus('idle'); };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!formEnabled || status === 'sending' || values.botcheck) return;
    if (values.name.trim().length < 2 || !validEmail(values.email) || values.message.trim().length < 15) { setErrorMessage('Please add your name, a valid email and a message of at least 15 characters.'); setStatus('error'); return; }
    setStatus('sending'); setErrorMessage('');
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: key, subject: 'New DevNov website enquiry', from_name: 'DevNov website', name: values.name.trim(), email: values.email.trim(), service: values.service, message: values.message.trim(), company: values.company.trim(), botcheck: values.botcheck }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error(result.message || 'Submission could not be completed.');
      setValues(initialState); setStatus('success');
    } catch (error) { setErrorMessage(error.message || 'There was a problem submitting your request. Please try again.'); setStatus('error'); }
  };
  const fieldClass = 'min-h-12 w-full rounded-xl border border-[#3b4b68] bg-[#111b2c] px-4 text-sm text-white outline-none placeholder:text-[#8191ab] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15';

  return (
    <section id="contact" className="dev-section bg-[#f7f9fc]" aria-labelledby="contact-heading">
      <div className="dev-container grid items-start gap-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-12">
        <div><SectionHeader eyebrow="Let's work together" id="contact-heading" title={<>Ready to build<br />what's next?</>} description="Tell us about your project. We would love to hear the idea and explore how we can help." />
          <div className="mt-7 space-y-3">{email && <a href={`mailto:${email}`} className="dev-card flex items-center gap-3 p-4 text-sm font-bold text-[#101b27]"><Mail className="size-5 text-[#ff4b16]" />{email} <ArrowUpRight className="ml-auto size-4 text-[#ff4b16]" /></a>}{booking && <a href={booking} target="_blank" rel="noopener noreferrer" className="dev-card flex items-center gap-3 p-4 text-sm font-bold text-[#101b27]"><CalendarDays className="size-5 text-[#ff4b16]" />Book a call <ArrowUpRight className="ml-auto size-4 text-[#ff4b16]" /></a>}</div>
          <div className="mt-8 flex items-start gap-3"><ShieldCheck className="mt-1 size-5 shrink-0 text-[#ff4b16]" /><p className="max-w-sm text-xs leading-6 text-[#708497]">Please share only non-sensitive information in your initial enquiry. We will discuss confidential details through an appropriate channel.</p></div>
        </div>
        <div className="dev-card p-6 sm:p-8"><div className="mb-6 flex items-center gap-3"><span className="dev-icon size-11"><MessageSquareText className="size-5" /></span><div><h3 className="text-lg font-extrabold text-[#101b27]">Let's discuss your project</h3><p className="mt-1 text-xs text-[#677c8e]">A few details are all we need to get started.</p></div></div>
          {formEnabled ? <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="hidden" aria-hidden="true"><label htmlFor="devnov-botcheck">Leave this field blank</label><input id="devnov-botcheck" name="botcheck" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={onChange} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="dev-input-label">Your name *<input className="dev-input mt-1.5" name="name" value={values.name} onChange={onChange} required maxLength={120} autoComplete="name" placeholder="Your name" /></label><label className="dev-input-label">Your email *<input className="dev-input mt-1.5" type="email" name="email" value={values.email} onChange={onChange} required maxLength={254} autoComplete="email" placeholder="you@company.com" /></label></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="dev-input-label">Company (optional)<input className="dev-input mt-1.5" name="company" value={values.company} onChange={onChange} maxLength={160} autoComplete="organization" placeholder="Company name" /></label><label className="dev-input-label">Project type<select className="dev-input mt-1.5" name="service" value={values.service} onChange={onChange}><option value="">Choose a service</option><option>Website or web app</option><option>Mobile app</option><option>Business software</option><option>AI & automation</option><option>Something else</option></select></label></div>
            <label className="dev-input-label">Tell us about your project *<textarea className="dev-input mt-1.5 min-h-[130px] resize-y" name="message" rows={5} minLength={15} maxLength={5000} value={values.message} onChange={onChange} required placeholder="What would you like to build?" /></label>
            {status === 'success' && <p role="status" className="rounded-lg border border-[#92ddbb] bg-[#e5f8ef] p-3 text-sm text-[#14784e]"><CheckCircle2 className="mr-2 inline size-4" />Your message was submitted successfully.</p>}
            {status === 'error' && <p role="alert" className="rounded-lg border border-[#f3aaa0] bg-[#fff1ed] p-3 text-sm text-[#9e3524]">{errorMessage}</p>}
            <button type="submit" disabled={status === 'sending'} className="dev-primary w-full disabled:cursor-wait disabled:opacity-65">{status === 'sending' ? 'Sending…' : 'Send Message'} <Send className="size-4" /></button>
            <p className="text-[10px] leading-5 text-[#728699]">This form securely submits through Web3Forms. Do not share passwords or payment details.</p>
          </form> : <div className="rounded-xl border border-dashed border-[#b9cbd7] bg-[#f3f7fa] p-6 sm:p-8"><h4 className="text-lg font-extrabold text-[#101b27]">Get in touch</h4><p className="mt-3 text-sm leading-7 text-[#61788c]">{email ? 'Email us directly and share your project requirements.' : booking ? 'Schedule a conversation using the booking link.' : 'The contact form is being configured. Add a verified contact method before launch.'}</p>{email ? <a href={`mailto:${email}`} className="dev-primary mt-5">Email {agency.brandName} <ArrowRight className="size-4" /></a> : booking ? <a href={booking} target="_blank" rel="noopener noreferrer" className="dev-primary mt-5">Schedule a call <ArrowRight className="size-4" /></a> : <p className="mt-4 text-xs font-semibold text-[#c14621]">Contact setup pending before public launch.</p>}</div>}
          {!canContact && <p className="mt-4 text-xs text-[#b64b2f]">Site owner: configure a verified email, booking URL or Web3Forms key.</p>}
        </div>
      </div>
    </section>
  );
}
