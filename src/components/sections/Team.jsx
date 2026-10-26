import { ArrowUpRight, UserRound } from 'lucide-react';
import { team as legacyTeam } from '../../data/agencyData.js';
import managedTeam from '../../data/team.json';
import SectionHeader from '../ui/SectionHeader.jsx';
const isSafeUrl = (value) => typeof value === 'string' && /^https:\/\/[a-z0-9.-]+(?:\:[0-9]+)?(?:[/?#][^\s]*)?$/i.test(value.trim());
const realProfiles = [...managedTeam, ...legacyTeam.filter((profile) => !managedTeam.some((entry) => entry.id === profile.id))].filter((profile) => profile.published !== false && profile.name && profile.role);

export default function Team() {
  // People profiles are only shown after an actual name, role and permission-approved
  // image are supplied. This prevents illustrative cards being presented as a real team.
  if (!realProfiles.length) return null;

  return (
    <section id="team" className="dev-section bg-[#f7f9fc]" aria-labelledby="team-heading">
      <div className="dev-container">
        <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeader eyebrow="Our team" title={<>The people behind<br />the work.</>} id="team-heading" description="Profiles are shared only with the person's approval." />
          <a href="#contact" className="dev-primary">Work with DevNov <ArrowUpRight className="size-4" /></a>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {realProfiles.map((person) => (
            <article key={person.id} className="dev-card overflow-hidden p-0">
              <div className="flex aspect-[4/4.5] items-center justify-center overflow-hidden bg-[#e6edf3]">
                {typeof person.image === 'string' && /^\/team\/[a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg|avif)$/i.test(person.image)
                  ? <img src={person.image} alt={`${person.name} profile portrait`} loading="lazy" className="h-full w-full object-cover" />
                  : <UserRound className="size-16 text-[#8ca0b1]" strokeWidth={1.3} aria-hidden="true" />}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-[#101b27]">{person.name}</h3>
                <p className="mt-1 text-xs font-semibold text-[#677c8c]">{person.role}</p>
                {person.summary && <p className="mt-3 text-xs leading-6 text-[#63798b]">{person.summary}</p>}
                <div className="mt-4 flex flex-wrap gap-3">
                  {(person.links || []).filter((link) => isSafeUrl(link.url)).map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#f34b1a]">
                      {link.label || 'Profile'} <ArrowUpRight className="size-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
