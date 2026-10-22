import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faq as agencyFaq } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';

const additionalQuestions = [
  { id: 'technology', question: 'Which technologies do you use?', answer: 'The right stack depends on the scope. Our capabilities include React, ASP.NET Core, Node.js, SQL Server, Python and modern AI integrations.' },
  { id: 'existing-app', question: 'Can you work on an existing product?', answer: 'Yes. We can review existing applications and discuss integrations, maintenance, modernization or specific feature development.' },
  { id: 'remote', question: 'Can Devnov work with international clients?', answer: 'We can discuss remote projects with businesses in Pakistan and internationally, with milestones and communication agreed during planning.' },
  { id: 'estimate', question: 'How do you estimate costs and timelines?', answer: 'We first clarify requirements, complexity, dependencies and priorities. From there, we can discuss a project-specific scope and estimate.' },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);
  const questions = [...agencyFaq, ...additionalQuestions.filter((item) => !agencyFaq.some((existing) => existing.id === item.id))];
  if (!questions.length) return null;
  return (
    <section id="faq" className="scroll-mt-24 border-t border-white/[.07] bg-[#0c1321] py-24 sm:py-28 lg:py-32" aria-labelledby="faq-heading">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-16 lg:px-10"><div><SectionHeader eyebrow="Questions, answered" id="faq-heading" title={<>Useful answers. <span className="text-indigo-300">No guesswork.</span></>} description="A few practical details about how Devnov approaches software projects."/><div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] p-4 text-xs text-slate-400"><HelpCircle className="size-4 text-indigo-300" aria-hidden="true" /> For a specific project, start a conversation.</div></div>
        <div className="space-y-3">{questions.map((item, i) => { const expanded = openItem === item.id; const contentId = `faq-answer-${i}`; return <article key={item.id} className={`overflow-hidden rounded-2xl border transition-colors ${expanded ? 'border-indigo-400/40 bg-[#1b2940]' : 'border-[#2a3850] bg-[#172337] hover:border-indigo-300/25'}`}><h3><button type="button" className="flex min-h-[76px] w-full items-center justify-between gap-6 px-6 py-5 text-left text-[15px] font-semibold text-white focus-visible:outline-offset-[-4px] sm:px-7" aria-expanded={expanded} aria-controls={contentId} onClick={() => setOpenItem(expanded ? null : item.id)}><span>{item.question}</span><ChevronDown className={`size-5 shrink-0 text-indigo-300 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" /></button></h3>{expanded && <div id={contentId} className="px-6 pb-6 text-sm leading-7 text-[#b0bcd0] sm:px-7">{item.answer}</div>}</article>; })}</div>
      </div>
    </section>
  );
}