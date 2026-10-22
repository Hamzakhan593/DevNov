import {
  ArrowUpRight,
  Atom,
  Bot,
  BrainCircuit,
  Cable,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Globe2,
  Layers3,
  MessageCircle,
  Network,
  Server,
  Sparkles,
  Workflow,
  Wrench,
  ScanSearch,
  Smartphone,
} from 'lucide-react';
import { technologies } from '../../data/agencyData.js';

// DevNov M17: display and icon mappings only; actual labels live in agencyData.js.
const stackIcons = {
  dotnet: Code2,
  react: Atom,
  next: Globe2,
  node: Server,
  mongo: Database,
  sql: Database,
  python: Code2,
  fastapi: Server,
  'ai-agents': Bot,
  'ai-chatbots': MessageCircle,
  'workflow-automation': Workflow,
  'whatsapp-automation': Smartphone,
  'llm-apps': BrainCircuit,
  'rag-vector-search': ScanSearch,
  'api-integrations': Cable,
  'cloud-deployment': Cloud,
  'prompt-engineering': Sparkles,
  'computer-vision': Network,
  'git-cicd': GitBranch,
};

const automationIds = new Set([
  'ai-agents',
  'ai-chatbots',
  'workflow-automation',
  'whatsapp-automation',
  'llm-apps',
  'rag-vector-search',
  'prompt-engineering',
  'computer-vision',
]);

function StackItem({ tech, isAi }) {
  const Icon = stackIcons[tech.id] || Wrench;
  return (
    <div className={`dn17-chip ${isAi ? 'dn17-chip-ai' : 'dn17-chip-core'}`} title={tech.category}>
      <span className="dn17-chip-icon" aria-hidden="true"><Icon size={19} strokeWidth={2.1} /></span>
      <span className="dn17-chip-name">{tech.label}</span>
    </div>
  );
}

export default function TechMarquee() {
  if (!technologies.length) return null;
  const core = technologies.filter((tech) => !automationIds.has(tech.id));
  const ai = technologies.filter((tech) => automationIds.has(tech.id));

  return (
    <section className="dn17-stack" aria-labelledby="dn17-stack-title">
      <div className="dev-container">
        <div className="dn17-stack-top">
          <div className="dn17-stack-title-block">
            <div className="dn17-stack-mark" aria-hidden="true"><Layers3 size={23} strokeWidth={2.25} /></div>
            <div>
              <div className="dn17-eyebrow">THE TOOLS BEHIND THE IDEAS</div>
              <h2 id="dn17-stack-title" className="dn17-heading">Our <span>stack.</span></h2>
              <p className="dn17-subtitle">Modern engineering, intelligent workflows and useful AI integrations.</p>
            </div>
          </div>
          <a href="#services" className="dn17-services-link">Explore our services <ArrowUpRight size={17} strokeWidth={2.2} /></a>
        </div>

        <div className="dn17-stack-groups">
          <div className="dn17-group dn17-group-core">
            <div className="dn17-group-heading">
              <span className="dn17-group-symbol dn17-symbol-core" aria-hidden="true"><Code2 size={17} strokeWidth={2.2}/></span>
              <div><h3>Core Development</h3><p>Web, backend, databases &amp; infrastructure</p></div>
            </div>
            <div className="dn17-grid">
              {core.map((tech) => <StackItem key={tech.id} tech={tech} isAi={false} />)}
            </div>
          </div>

          {ai.length > 0 && (
            <div className="dn17-group dn17-group-ai">
              <div className="dn17-group-heading">
                <span className="dn17-group-symbol dn17-symbol-ai" aria-hidden="true"><BrainCircuit size={18} strokeWidth={2.2}/></span>
                <div><h3>AI &amp; Automation</h3><p>Agents, AI apps &amp; smart business workflows</p></div>
              </div>
              <div className="dn17-grid">
                {ai.map((tech) => <StackItem key={tech.id} tech={tech} isAi />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
