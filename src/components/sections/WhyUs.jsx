import { ArrowRight, Blocks, Headphones, Lightbulb, Palette } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader.jsx';

const items = [
  { title: 'Start with the problem', description: 'We begin with the business goal, the users and the decisions that will shape the work.', Icon: Lightbulb },
  { title: 'Design for real use', description: 'Clear journeys and considered interfaces make even complex software easier to understand.', Icon: Palette },
  { title: 'Build for the next step', description: 'We make practical engineering choices with future changes and growth in mind.', Icon: Blocks },
  { title: 'Keep the loop open', description: 'Questions, feedback and handover stay part of the process—not an afterthought.', Icon: Headphones },
];

export default function WhyUs() {
  return (
    <section id="why-devnov" className="dev-section dn20-value-section" aria-labelledby="why-heading">
      <div className="dev-container">
        <div className="dn20-value-intro">
          <SectionHeader
            id="why-heading"
            eyebrow="Why DevNov"
            title={<>A partner for<br />your next big idea.</>}
            description="Clear thinking, thoughtful craft and dependable delivery make ambitious work feel more manageable."
          />
          <aside className="dn20-value-aside" aria-label="How DevNov approaches a project">
            <span className="dn20-value-aside-kicker">A practical partnership</span>
            <p>Bring the context you have. We will help turn it into a focused product conversation.</p>
            <a href="#contact" className="dn20-inline-link">Start a conversation <ArrowRight className="size-4" aria-hidden="true" /></a>
          </aside>
        </div>

        <div className="dn20-value-grid">
          {items.map(({ title, description, Icon }, index) => (
            <article key={title} className="dn20-value-card">
              <div className="dn20-value-card-top">
                <span className={`dev-icon ${index % 2 ? 'dev-icon-dark' : ''}`}><Icon className="size-6" strokeWidth={1.9} aria-hidden="true" /></span>
                <span className="dn20-value-index">0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
