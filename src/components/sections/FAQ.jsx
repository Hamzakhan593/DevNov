import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faq as agencyFaq } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';
const additionalQuestions = [
  { id: 'technology', question: 'Which technologies do you use?', answer: 'The right stack depends on the scope. Our capabilities include React, ASP.NET Core, Node.js, SQL Server, Python and modern AI integrations.' },
  { id: 'existing-app', question: 'Can you work on an existing product?', answer: 'Yes. We can review existing applications and discuss integrations, maintenance, modernization or specific feature development.' },
  { id: 'remote', question: 'Can DevNov work with international clients?', answer: 'We can discuss remote projects with businesses in Pakistan and internationally, with milestones and communication agreed during planning.' },
  { id: 'estimate', question: 'How do you estimate costs and timelines?', answer: 'We first clarify requirements, complexity, dependencies and priorities. From there, we can discuss a project-specific scope and estimate.' },
];
export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);
  const questions = [...agencyFaq, ...additionalQuestions.filter((item) => !agencyFaq.some((existing) => existing.id === item.id))];
  if (!questions.length) return null;
  return <section id="faq" className="dev-section bg-white" aria-labelledby="faq-heading"><div className="dev-container grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-12"><div><SectionHeader eyebrow="Questions, answered" id="faq-heading" title="Frequently asked questions." description="Useful details before we start working together."/><p className="mt-6 inline-flex items-center gap-2 text-xs text-[#667d8d]"><HelpCircle className="size-4 text-[#ff4b16]" />Have another question? Get in touch.</p></div><div className="space-y-3">{questions.map((item,i) => { const expanded = openItem === item.id; const contentId = `faq-answer-${i}`; return <article key={item.id} className="dev-card overflow-hidden p-0"><h3><button type="button" aria-expanded={expanded} aria-controls={contentId} onClick={() => setOpenItem(expanded ? null : item.id)} className="flex min-h-[67px] w-full items-center justify-between gap-5 px-5 py-4 text-left text-sm font-extrabold text-[#101b27] sm:px-6"><span>{item.question}</span><ChevronDown className={`size-5 shrink-0 text-[#ff4b16] transition-transform ${expanded ? 'rotate-180' : ''}`} /></button></h3>{expanded && <div id={contentId} className="px-5 pb-5 text-sm leading-7 text-[#647b8f] sm:px-6">{item.answer}</div>}</article>; })}</div></div></section>;
}
