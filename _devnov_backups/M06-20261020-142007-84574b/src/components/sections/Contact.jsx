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
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: key, subject: 'New Devnov website enquiry', from_name: 'Devnov website', name: values.name.trim(), email: values.email.trim(), service: values.service, message: values.message.trim(), company: values.company.trim(), botcheck: values.botcheck }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error(result.message || 'Submission could not be completed.');
      setValues(initialState); setStatus('success');
    } catch (error) { setErrorMessage(error.message || 'There was a problem submitting your request. Please try again.'); setStatus('error'); }
  };
  const fieldClass = 'min-h-12 w-full rounded-xl border border-[#3b4b68] bg-[#111b2c] px-4 text-sm text-white outline-none placeholder:text-[#8191ab] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15';

  return (
    <section id="contact" className="scroll-mt-24 border-t border-white/[.07] bg-[#0e1624] py-24 sm:py-28 lg:py-32" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.86fr_1.14fr] lg:gap-14">
          <div><SectionHeader eyebrow="Start a conversation" id="contact-heading" title={<>Great products start with <span className="text-indigo-300">a real conversation.</span></>} description="Tell us what you're trying to achieve, what you've built so far and what kind of help you're looking for."/>
            <div className="mt-9 space-y-4">
              {email && <a href={`mailto:${email}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1b2940] p-5 transition hover:border-indigo-400/40"><span className="grid size-11 place-items-center rounded-xl bg-indigo-500/15 text-indigo-200"><Mail className="size-5" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-xs text-slate-400">Email us directly</span><span className="mt-1 block truncate text-sm font-semibold text-white">{email}</span></span><ArrowUpRight className="size-4 text-indigo-300" aria-hidden="true" /></a>}
              {booking && <a href={booking} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1b2940] p-5 transition hover:border-indigo-400/40"><span className="grid size-11 place-items-center rounded-xl bg-indigo-500/15 text-indigo-200"><CalendarDays className="size-5" aria-hidden="true" /></span><span className="flex-1"><span className="block text-xs text-slate-400">Prefer a short call?</span><span className="mt-1 block text-sm font-semibold text-white">Schedule a conversation</span></span><ArrowUpRight className="size-4 text-indigo-300" aria-hidden="true" /></a>}
              <div className="flex items-start gap-3 rounded-xl border border-white/[.08] bg-white/[.025] p-5 text-xs leading-6 text-[#a7b5cb]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" /><span>Only share what you are comfortable including in an initial enquiry. Do not submit passwords, payment information or confidential records.</span></div>
            </div>
          </div>
          <div className="rounded-[24px] border border-[#34445d] bg-[#1b2a41] p-6 shadow-[0_30px_90px_rgba(1,4,15,.25)] sm:p-8">
            <div className="mb-7 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-indigo-500/15 text-indigo-200"><MessageSquareText className="size-5" aria-hidden="true" /></span><div><h3 className="text-lg font-semibold text-white">Project enquiry</h3><p className="mt-1 text-xs text-slate-400">Share a few details to help frame the discussion.</p></div></div>
            {formEnabled ? <form className="space-y-5" onSubmit={onSubmit} noValidate>
              <div className="hidden" aria-hidden="true"><label htmlFor="devnov-botcheck">Leave this field blank</label><input id="devnov-botcheck" name="botcheck" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={onChange}/></div>
              <div className="grid gap-5 sm:grid-cols-2"><label className="block text-xs font-medium text-slate-200">Your name <span className="text-indigo-300">*</span><input name="name" value={values.name} onChange={onChange} required maxLength={120} autoComplete="name" placeholder="Your name" className={`mt-2 ${fieldClass}`} /></label><label className="block text-xs font-medium text-slate-200">Email address <span className="text-indigo-300">*</span><input type="email" name="email" value={values.email} onChange={onChange} required maxLength={254} autoComplete="email" placeholder="you@company.com" className={`mt-2 ${fieldClass}`} /></label></div>
              <div className="grid gap-5 sm:grid-cols-2"><label className="block text-xs font-medium text-slate-200">Company (optional)<input name="company" value={values.company} onChange={onChange} maxLength={160} autoComplete="organization" placeholder="Company name" className={`mt-2 ${fieldClass}`} /></label><label className="block text-xs font-medium text-slate-200">Interested in<select name="service" value={values.service} onChange={onChange} className={`mt-2 ${fieldClass}`}><option value="">Select a service</option><option>Website or web app</option><option>Mobile app</option><option>Business software</option><option>AI & automation</option><option>Something else</option></select></label></div>
              <label className="block text-xs font-medium text-slate-200">Tell us about your project <span className="text-indigo-300">*</span><textarea name="message" value={values.message} onChange={onChange} rows={6} minLength={15} maxLength={5000} required placeholder="What are you building? What problem should it solve?" className={`mt-2 w-full resize-y py-3 ${fieldClass}`}/></label>
              {status === 'success' && <p role="status" className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200"><CheckCircle2 className="size-5" aria-hidden="true"/> Your message was submitted successfully.</p>}
              {status === 'error' && <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{errorMessage}</p>}
              <button type="submit" disabled={status === 'sending'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60">{status === 'sending' ? 'Sending your enquiry…' : 'Send your enquiry'} <Send className="size-4" aria-hidden="true" /></button><p className="text-xs leading-6 text-slate-400">Submitting sends this information to our contact form provider (Web3Forms). Please do not include sensitive information.</p>
            </form> : <div className="flex min-h-[380px] flex-col justify-center rounded-2xl border border-dashed border-[#485775] bg-[#152138] p-7"><span className="grid size-12 place-items-center rounded-xl border border-indigo-400/20 bg-indigo-500/15 text-indigo-200"><Mail className="size-6" aria-hidden="true" /></span><h4 className="mt-6 text-xl font-semibold text-white">Let's discuss your project.</h4><p className="mt-3 text-sm leading-7 text-slate-400">{email ? 'Prefer email? Reach out directly and share your project details.' : booking ? 'You can schedule a conversation using the booking link.' : 'Our online enquiry form is being configured. Please check back once contact details are published.'}</p>{email ? <a href={`mailto:${email}`} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white hover:bg-indigo-400">Email Devnov <ArrowRight className="size-4" aria-hidden="true"/></a> : booking ? <a href={booking} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white hover:bg-indigo-400">Schedule a call <ArrowRight className="size-4" aria-hidden="true"/></a> : <p className="mt-6 text-xs text-indigo-300">Contact setup pending before public launch.</p>}</div>}
            {!canContact && <p className="mt-4 text-xs text-amber-200/80">Website owner: configure a verified email, booking URL or Web3Forms key before publishing.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}