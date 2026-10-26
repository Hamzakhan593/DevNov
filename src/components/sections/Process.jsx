import { ArrowRight, ClipboardList, Code2, Compass, PencilRuler, Rocket } from 'lucide-react';
import { processSteps } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';
const icons = { discover: Compass, plan: ClipboardList, design: PencilRuler, build: Code2, launch: Rocket };
const withDesignStep = processSteps.some((step) => step.id === 'design') ? processSteps : processSteps.flatMap((step) => step.id === 'build' ? [{ id:'design', title:'Design', description:'Shape an intuitive and engaging experience.' },step] : [step]);
export default function Process() {
  return (
    <section id="process" className="dev-section dn20-process-section" aria-labelledby="process-heading">
      <div className="dev-container">
        <div className="dn20-process-intro">
          <SectionHeader
            eyebrow="Our process"
            id="process-heading"
            title={<>A clear path<br />from idea to impact.</>}
            description="A practical, collaborative process that makes the next step clear before the work begins."
          />
          <a href="#contact" className="dev-secondary dn20-process-cta">Get started <ArrowRight className="size-4" aria-hidden="true" /></a>
        </div>

        <ol className="dn20-process-list" aria-label="DevNov project process">
          {withDesignStep.map((step, index) => {
            const Icon = icons[step.id] || Compass;
            return (
              <li key={step.id} className="dn20-process-step">
                <div className="dn20-process-step-top">
                  <span className="dn20-process-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="dn20-process-icon"><Icon className="size-5" aria-hidden="true" /></span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>

        <div className="dn20-process-note">
          <span>Already have a brief or product in progress?</span>
          <a href="#contact">Start with the context you have <ArrowRight className="size-4" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
