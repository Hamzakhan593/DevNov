import { ArrowRight, ArrowUpRight, Code2, ExternalLink, Github, ImageIcon } from 'lucide-react';
const safeLink = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());
const safeImage = (value) => typeof value === 'string' && (safeLink(value) || /^\/projects\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|webp|avif)$/i.test(value));
export default function ProjectCard({ project, onDetails }) {
  const tools = Array.isArray(project.technologies) ? project.technologies : [];
  const category = project.category || 'Software';
  const label = project.demo ? 'Concept preview' : category;
  return (
    <article className="dn-project-card">
      <button type="button" className="dn-project-preview" onClick={onDetails} aria-label={`View project details: ${project.title}`}>
        {safeImage(project.image) ? <img src={project.image} alt={project.imageAlt || `${project.title} product screenshot`} loading="lazy" decoding="async" /> : <span className="dn-project-placeholder"><span><Code2 size={24} aria-hidden="true" /></span><span><ImageIcon size={14} aria-hidden="true" /> Screenshot coming soon</span></span>}
        <span className="dn-project-preview-icon" aria-hidden="true"><ArrowUpRight size={17} /></span>
      </button>
      <div className="dn-project-content">
        <p className="dn-project-category">{label}</p>
        <h3 className="dn-project-title">{project.title}</h3>
        <p className="dn-project-summary">{project.summary}</p>
        {tools.length > 0 && <ul className="dn-project-tools" aria-label="Project technologies">{tools.map((tool, index) => <li key={`${tool}-${index}`}>{tool}</li>)}</ul>}
        <div className="dn-project-actions">
          <button type="button" onClick={onDetails} className="dn-project-primary" aria-label={`${project.demo ? 'Preview concept' : 'Read case study'}: ${project.title}`}>{project.demo ? 'Preview concept' : 'Read case study'} <ArrowRight size={15} aria-hidden="true" /></button>
          {(safeLink(project.liveUrl) || safeLink(project.repositoryUrl)) && <div className="dn-project-secondary-actions">
            {safeLink(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open project: ${project.title} (opens in a new tab)`}>Project link <ExternalLink size={14} aria-hidden="true" /></a>}
            {safeLink(project.repositoryUrl) && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" aria-label={`View source: ${project.title} (opens in a new tab)`}>Source <Github size={14} aria-hidden="true" /></a>}
          </div>}
        </div>
      </div>
    </article>
  );
}
