import { ArrowUpRight, UserRound } from 'lucide-react';
import { team as legacyTeam } from '../../data/agencyData.js';
import managedTeam from '../../data/team.json';
import SectionHeader from '../ui/SectionHeader.jsx';

const isSafeUrl = (value) => typeof value === 'string' && /^https:\/\/[a-z0-9.-]+(?:\:[0-9]+)?(?:[/?#][^\s]*)?$/i.test(value.trim());
const profiles = [...managedTeam, ...legacyTeam.filter((profile) => !managedTeam.some((entry) => entry.id === profile.id))].filter((profile) => profile.published !== false && profile.name && profile.role);

export default function Team() {
  if (!profiles.length) return null;
  return (
    <section id="team" className="scroll-mt-24 border-t border-white/[.07] bg-[#111a2a] py-24 sm:py-28 lg:py-32" aria-labelledby="team-heading"><div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10"><SectionHeader eyebrow="The people behind the work" title="Meet the Devnov team." id="team-heading" description="Real engineers, designers and builders. Every profile is published with the person's approval."/><div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{profiles.map((person) => <article key={person.id} className="overflow-hidden rounded-[22px] border border-[#334059] bg-[#1d2b41]"><div className="flex aspect-[16/11] items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500/15 via-[#243550] to-[#151e2d]">{typeof person.image === 'string' && /^\/team\/[a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg|avif)$/i.test(person.image) ? <img src={person.image} alt={`${person.name} profile portrait`} loading="lazy" className="h-full w-full object-cover" /> : <UserRound className="size-16 text-indigo-200/60" strokeWidth={1.2} aria-hidden="true" />}</div><div className="p-6"><h3 className="text-xl font-semibold text-white">{person.name}</h3><p className="mt-1.5 text-sm font-medium text-indigo-300">{person.role}</p>{person.summary && <p className="mt-4 text-sm leading-7 text-[#b2bfd0]">{person.summary}</p>}<div className="mt-5 flex flex-wrap gap-3">{(person.links || []).filter((link) => isSafeUrl(link.url)).map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-200 hover:text-white">{link.label || 'Profile'} <ArrowUpRight className="size-3.5" aria-hidden="true" /></a>)}</div></div></article>)}</div></div></section>
  );
}