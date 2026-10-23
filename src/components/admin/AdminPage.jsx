import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Eye,
  EyeOff,
  FolderKanban,
  ImagePlus,
  Layers3,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import './admin.css';

const PROJECT_MEDIA_BUCKET = 'project-media';

const blankProject = () => ({
  id: '',
  slug: '',
  title: '',
  summary: '',
  category: '',
  challenge: '',
  solution: '',
  outcome: '',
  image_path: '',
  image_alt: '',
  live_url: '',
  repository_url: '',
  featured: false,
  published: false,
  sort_order: 0,
});

const blankService = () => ({
  id: '',
  slug: '',
  title: '',
  description: '',
  capabilities_text: '',
  icon_key: '',
  published: false,
  sort_order: 0,
});

const blankTechnology = () => ({
  id: '',
  slug: '',
  label: '',
  category: '',
  group: 'core',
  icon_key: '',
  published: false,
  sort_order: 0,
});

function configured() {
  return typeof isSupabaseConfigured === 'function'
    ? isSupabaseConfigured()
    : Boolean(isSupabaseConfigured);
}

function slugify(value) {
  const slug = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `item-${Date.now()}`;
}

function safeFileName(name) {
  const extension = name.includes('.') ? `.${name.split('.').pop().toLowerCase()}` : '';
  const stem = name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);

  return `${stem || 'project-image'}${extension}`;
}

function nullable(value) {
  const trimmed = typeof value === 'string' ? value.trim() : value;
  return trimmed === '' ? null : trimmed;
}

function sortableNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
}

function validHttpsUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function messageFrom(error, fallback = 'Something went wrong. Please try again.') {
  return error?.message || fallback;
}

function passwordActionFromLocation() {
  if (typeof window === 'undefined') return '';

  const actionFrom = (value) => {
    const type = new URLSearchParams(value).get('type');
    return type === 'recovery' || type === 'invite' ? type : '';
  };

  return actionFrom(window.location.hash.replace(/^#/, '')) || actionFrom(window.location.search);
}

function clearPasswordActionFromLocation() {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;
  // The recovery token is only useful once. Remove it from the address bar as
  // soon as a password is safely saved (or the user explicitly signs out).
  window.history.replaceState(null, document.title, window.location.pathname);
}

function useSignedProjectImage(path) {
  const [signedUrl, setSignedUrl] = useState('');

  useEffect(() => {
    let active = true;
    setSignedUrl('');
    if (!path || !supabase) return () => { active = false; };

    supabase.storage.from(PROJECT_MEDIA_BUCKET).createSignedUrl(path, 60 * 60)
      .then(({ data, error }) => {
        if (active && !error) setSignedUrl(data?.signedUrl || '');
      })
      .catch(() => {
        // A missing or inaccessible image should not prevent content management.
      });

    return () => { active = false; };
  }, [path]);

  return signedUrl;
}

function toProjectDraft(project) {
  if (!project) return blankProject();

  return {
    ...blankProject(),
    ...project,
    image_path: project.image_path || '',
    live_url: project.live_url || '',
    repository_url: project.repository_url || '',
    challenge: project.challenge || '',
    solution: project.solution || '',
    outcome: project.outcome || '',
    image_alt: project.image_alt || '',
    sort_order: project.sort_order ?? 0,
  };
}

function toServiceDraft(service) {
  if (!service) return blankService();

  return {
    ...blankService(),
    ...service,
    capabilities_text: Array.isArray(service.capabilities) ? service.capabilities.join(', ') : '',
    icon_key: service.icon_key || '',
    sort_order: service.sort_order ?? 0,
  };
}

function toTechnologyDraft(technology) {
  if (!technology) return blankTechnology();

  return {
    ...blankTechnology(),
    ...technology,
    icon_key: technology.icon_key || '',
    group: technology.group === 'ai' ? 'ai' : 'core',
    sort_order: technology.sort_order ?? 0,
  };
}

function IconButton({ label, children, className = '', ...props }) {
  return (
    <button className={`admin-icon-button ${className}`.trim()} type="button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

function Field({ label, hint, required = false, children }) {
  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}{required ? <em>Required</em> : null}</span>
      {children}
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </div>
  );
}

function TextInput({ value, onChange, ...props }) {
  return <input className="admin-input" value={value ?? ''} onChange={onChange} {...props} />;
}

function EmptyState({ icon: Icon = FolderKanban, title, children, action }) {
  return (
    <div className="admin-empty-state">
      <span className="admin-empty-icon"><Icon size={25} strokeWidth={1.7} /></span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}

function Notice({ feedback, onDismiss }) {
  if (!feedback) return null;
  const Icon = feedback.kind === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`admin-notice admin-notice--${feedback.kind}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>
      <Icon size={19} aria-hidden="true" />
      <p>{feedback.text}</p>
      <IconButton label="Dismiss message" onClick={onDismiss}><X size={17} /></IconButton>
    </div>
  );
}

function LoadingState({ label = 'Loading your workspace…' }) {
  return (
    <div className="admin-loading-state" role="status">
      <LoaderCircle size={28} className="admin-spin" />
      <span>{label}</span>
    </div>
  );
}

function ConfigState() {
  return (
    <section className="devnov-admin admin-gate" aria-labelledby="admin-configuration-heading">
      <div className="admin-gate-card">
        <span className="admin-brand-mark"><ShieldCheck size={26} /></span>
        <p className="admin-eyebrow">DevNov content studio</p>
        <h1 id="admin-configuration-heading">Connect Supabase to open the admin area.</h1>
        <p>
          This page needs the public Supabase URL and publishable key before it can securely load portfolio content.
        </p>
        <div className="admin-code-note">
          <code>VITE_SUPABASE_URL</code>
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
        </div>
        <p className="admin-gate-footnote">Add them to your deployment environment or local <code>.env</code>, then restart the app.</p>
      </div>
    </section>
  );
}

function SignIn({ onSubmit, credentials, onChange, loading, error, onPasswordReset, passwordResetLoading, passwordResetMessage }) {
  return (
    <section className="devnov-admin admin-gate" aria-labelledby="admin-signin-heading">
      <form className="admin-gate-card admin-signin-card" onSubmit={onSubmit}>
        <span className="admin-brand-mark"><ShieldCheck size={26} /></span>
        <p className="admin-eyebrow">DevNov content studio</p>
        <h1 id="admin-signin-heading">Sign in to manage the portfolio.</h1>
        <p>Only accounts with an <strong>admin</strong> profile role can make content changes.</p>
        {error ? <div className="admin-inline-error" role="alert"><CircleAlert size={17} />{error}</div> : null}
        <Field label="Email address" required>
          <TextInput
            type="email"
            autoComplete="email"
            placeholder="you@devnov.com"
            value={credentials.email}
            onChange={(event) => onChange({ ...credentials, email: event.target.value })}
            required
          />
        </Field>
        <Field label="Password" required>
          <TextInput
            type="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={(event) => onChange({ ...credentials, password: event.target.value })}
            required
          />
        </Field>
        {passwordResetMessage ? <div className="admin-inline-success" role="status"><CheckCircle2 size={17} />{passwordResetMessage}</div> : null}
        <button className="admin-text-button admin-forgot-password" type="button" onClick={onPasswordReset} disabled={loading || passwordResetLoading}>
          {passwordResetLoading ? <LoaderCircle size={16} className="admin-spin" /> : null}
          {passwordResetLoading ? 'Sending reset link…' : 'Forgot password?'}
        </button>
        <button className="admin-primary-button admin-primary-button--full" type="submit" disabled={loading}>
          {loading ? <LoaderCircle size={18} className="admin-spin" /> : <ShieldCheck size={18} />}
          {loading ? 'Signing in…' : 'Sign in securely'}
        </button>
      </form>
    </section>
  );
}

function PasswordSetup({ action, passwordDraft, onChange, onSubmit, loading, error, onSignOut }) {
  const isInvite = action === 'invite';

  return (
    <section className="devnov-admin admin-gate" aria-labelledby="admin-password-setup-heading">
      <form className="admin-gate-card admin-signin-card" onSubmit={onSubmit}>
        <span className="admin-brand-mark"><ShieldCheck size={26} /></span>
        <p className="admin-eyebrow">DevNov content studio</p>
        <h1 id="admin-password-setup-heading">{isInvite ? 'Set your admin password.' : 'Choose a new password.'}</h1>
        <p>{isInvite ? 'Your invitation is ready. Create a password to finish setting up this account.' : 'Create a new password for your DevNov content studio account.'}</p>
        {error ? <div className="admin-inline-error" role="alert"><CircleAlert size={17} />{error}</div> : null}
        <Field label="New password" required hint="Use at least 8 characters.">
          <TextInput
            type="password"
            autoComplete="new-password"
            value={passwordDraft.password}
            onChange={(event) => onChange({ ...passwordDraft, password: event.target.value })}
            minLength="8"
            required
          />
        </Field>
        <Field label="Confirm new password" required>
          <TextInput
            type="password"
            autoComplete="new-password"
            value={passwordDraft.confirmPassword}
            onChange={(event) => onChange({ ...passwordDraft, confirmPassword: event.target.value })}
            minLength="8"
            required
          />
        </Field>
        <button className="admin-primary-button admin-primary-button--full" type="submit" disabled={loading}>
          {loading ? <LoaderCircle size={18} className="admin-spin" /> : <ShieldCheck size={18} />}
          {loading ? 'Saving password…' : 'Save password and continue'}
        </button>
        <button className="admin-text-button admin-password-cancel" type="button" onClick={onSignOut} disabled={loading}>Use another account</button>
      </form>
    </section>
  );
}

function AccessDenied({ onSignOut, profileError, retry, retrying }) {
  return (
    <section className="devnov-admin admin-gate" aria-labelledby="admin-access-heading">
      <div className="admin-gate-card">
        <span className="admin-brand-mark admin-brand-mark--warning"><CircleAlert size={26} /></span>
        <p className="admin-eyebrow">Access restricted</p>
        <h1 id="admin-access-heading">This account is not an admin.</h1>
        <p>
          Your account is signed in, but its profile does not have the <strong>admin</strong> role required for this area.
        </p>
        {profileError ? <div className="admin-inline-error" role="alert"><CircleAlert size={17} />{profileError}</div> : null}
        <div className="admin-gate-actions">
          <button className="admin-secondary-button" type="button" onClick={retry} disabled={retrying}>
            {retrying ? <LoaderCircle size={17} className="admin-spin" /> : <RefreshCw size={17} />}
            Check role again
          </button>
          <button className="admin-text-button" type="button" onClick={onSignOut}><LogOut size={16} /> Sign out</button>
        </div>
      </div>
    </section>
  );
}

function ProjectEditor({
  draft,
  onChange,
  technologies,
  selectedTechnologyIds,
  onToggleTechnology,
  imageFile,
  onImageFile,
  removeCurrentImage,
  onRemoveCurrentImage,
  onSave,
  onCancel,
  saving,
}) {
  const existingImageUrl = useSignedProjectImage(draft.image_path);

  return (
    <form className="admin-editor" onSubmit={onSave}>
      <div className="admin-editor-header">
        <div>
          <p className="admin-eyebrow">{draft.id ? 'Edit project' : 'New project'}</p>
          <h2>{draft.id ? draft.title || 'Untitled project' : 'Add a portfolio project'}</h2>
        </div>
        <IconButton label="Close project editor" onClick={onCancel}><X size={19} /></IconButton>
      </div>

      <div className="admin-form-grid admin-form-grid--two">
        <Field label="Project title" required>
          <TextInput value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} placeholder="e.g. Ledgerly" required />
        </Field>
        <Field label="Category" required>
          <TextInput value={draft.category} onChange={(event) => onChange({ ...draft, category: event.target.value })} placeholder="e.g. Finance platform" required />
        </Field>
        <Field label="URL slug" hint="Used in links. Leave it blank to generate one from the title.">
          <TextInput value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} placeholder="ledgerly" />
        </Field>
        <Field label="Display order" hint="Lower numbers appear first.">
          <TextInput type="number" min="0" step="1" value={draft.sort_order} onChange={(event) => onChange({ ...draft, sort_order: event.target.value })} />
        </Field>
      </div>

      <Field label="Short summary" required hint="A concise public description for the portfolio card.">
        <textarea className="admin-textarea" rows="3" value={draft.summary} onChange={(event) => onChange({ ...draft, summary: event.target.value })} required />
      </Field>

      <div className="admin-form-grid admin-form-grid--three">
        <Field label="Challenge">
          <textarea className="admin-textarea" rows="5" value={draft.challenge} onChange={(event) => onChange({ ...draft, challenge: event.target.value })} />
        </Field>
        <Field label="Solution">
          <textarea className="admin-textarea" rows="5" value={draft.solution} onChange={(event) => onChange({ ...draft, solution: event.target.value })} />
        </Field>
        <Field label="Outcome">
          <textarea className="admin-textarea" rows="5" value={draft.outcome} onChange={(event) => onChange({ ...draft, outcome: event.target.value })} />
        </Field>
      </div>

      <div className="admin-form-grid admin-form-grid--two">
        <Field label="Live project URL" hint="A published project needs an HTTPS link clients can visit.">
          <TextInput type="url" value={draft.live_url} onChange={(event) => onChange({ ...draft, live_url: event.target.value })} placeholder="https://example.com" />
        </Field>
        <Field label="Repository URL" hint="Optional; only add public or approved repositories.">
          <TextInput type="url" value={draft.repository_url} onChange={(event) => onChange({ ...draft, repository_url: event.target.value })} placeholder="https://github.com/…" />
        </Field>
      </div>

      <div className="admin-form-grid admin-form-grid--two">
        <Field label="Project image" hint="JPG, PNG, WebP, GIF, or AVIF; up to 8 MB.">
          <div className="admin-upload-row">
            <label className="admin-upload-button">
              <Upload size={17} />
              <span>{imageFile ? 'Choose another image' : 'Choose image'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={(event) => onImageFile(event.target.files?.[0] || null)}
              />
            </label>
            {imageFile ? <span className="admin-file-name">{imageFile.name}</span> : null}
          </div>
          {existingImageUrl && !imageFile && !removeCurrentImage ? (
            <div className="admin-image-preview">
              <img src={existingImageUrl} alt="Current project asset" />
              <label className="admin-checkbox-row admin-checkbox-row--compact"><input type="checkbox" checked={removeCurrentImage} onChange={(event) => onRemoveCurrentImage(event.target.checked)} /> Remove current image</label>
            </div>
          ) : null}
        </Field>
        <Field label="Image alt text" hint="Describe the image for visitors using screen readers.">
          <TextInput value={draft.image_alt} onChange={(event) => onChange({ ...draft, image_alt: event.target.value })} placeholder="Dashboard view of Ledgerly" />
        </Field>
      </div>

      <fieldset className="admin-tech-picker">
        <legend>Technologies used</legend>
        <p>Select the stack actually used for this project. Add technologies first if they are not listed here.</p>
        {technologies.length ? (
          <div className="admin-tech-options">
            {technologies.map((technology) => (
              <label className="admin-tech-option" key={technology.id}>
                <input
                  type="checkbox"
                  checked={selectedTechnologyIds.includes(technology.id)}
                  onChange={() => onToggleTechnology(technology.id)}
                />
                <span>{technology.label}</span>
                {technology.category ? <small>{technology.category}</small> : null}
              </label>
            ))}
          </div>
        ) : <p className="admin-picker-empty">No technologies have been created yet.</p>}
      </fieldset>

      <div className="admin-switches">
        <label className="admin-checkbox-row"><input type="checkbox" checked={draft.featured} onChange={(event) => onChange({ ...draft, featured: event.target.checked })} /> Feature this project</label>
        <label className="admin-checkbox-row"><input type="checkbox" checked={draft.published} onChange={(event) => onChange({ ...draft, published: event.target.checked })} /> Publish it on the public portfolio</label>
      </div>

      <div className="admin-editor-actions">
        <button type="button" className="admin-secondary-button" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="admin-primary-button" disabled={saving}>
          {saving ? <LoaderCircle size={17} className="admin-spin" /> : <CheckCircle2 size={17} />}
          {saving ? 'Saving…' : 'Save project'}
        </button>
      </div>
    </form>
  );
}

function ServiceEditor({ draft, onChange, onSave, onCancel, saving }) {
  return (
    <form className="admin-editor" onSubmit={onSave}>
      <div className="admin-editor-header">
        <div>
          <p className="admin-eyebrow">{draft.id ? 'Edit service' : 'New service'}</p>
          <h2>{draft.id ? draft.title || 'Untitled service' : 'Add a service'}</h2>
        </div>
        <IconButton label="Close service editor" onClick={onCancel}><X size={19} /></IconButton>
      </div>
      <div className="admin-form-grid admin-form-grid--two">
        <Field label="Service title" required><TextInput value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} required /></Field>
        <Field label="URL slug" hint="Leave blank to generate from the title."><TextInput value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} /></Field>
        <Field label="Icon key" hint="Optional identifier used by the public interface."><TextInput value={draft.icon_key} onChange={(event) => onChange({ ...draft, icon_key: event.target.value })} placeholder="e.g. code-2" /></Field>
        <Field label="Display order" hint="Lower numbers appear first."><TextInput type="number" min="0" step="1" value={draft.sort_order} onChange={(event) => onChange({ ...draft, sort_order: event.target.value })} /></Field>
      </div>
      <Field label="Description" required><textarea className="admin-textarea" rows="4" value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} required /></Field>
      <Field label="Capabilities" hint="Separate each capability with a comma or a new line."><textarea className="admin-textarea" rows="3" value={draft.capabilities_text} onChange={(event) => onChange({ ...draft, capabilities_text: event.target.value })} placeholder="React, Product engineering, API integration" /></Field>
      <div className="admin-switches"><label className="admin-checkbox-row"><input type="checkbox" checked={draft.published} onChange={(event) => onChange({ ...draft, published: event.target.checked })} /> Publish this service</label></div>
      <div className="admin-editor-actions"><button type="button" className="admin-secondary-button" onClick={onCancel} disabled={saving}>Cancel</button><button type="submit" className="admin-primary-button" disabled={saving}>{saving ? <LoaderCircle size={17} className="admin-spin" /> : <CheckCircle2 size={17} />}{saving ? 'Saving…' : 'Save service'}</button></div>
    </form>
  );
}

function TechnologyEditor({ draft, onChange, onSave, onCancel, saving }) {
  return (
    <form className="admin-editor" onSubmit={onSave}>
      <div className="admin-editor-header">
        <div>
          <p className="admin-eyebrow">{draft.id ? 'Edit technology' : 'New technology'}</p>
          <h2>{draft.id ? draft.label || 'Untitled technology' : 'Add a technology'}</h2>
        </div>
        <IconButton label="Close technology editor" onClick={onCancel}><X size={19} /></IconButton>
      </div>
      <div className="admin-form-grid admin-form-grid--two">
        <Field label="Technology name" required><TextInput value={draft.label} onChange={(event) => onChange({ ...draft, label: event.target.value })} placeholder="e.g. React" required /></Field>
        <Field label="Category" required><TextInput value={draft.category} onChange={(event) => onChange({ ...draft, category: event.target.value })} placeholder="e.g. Frontend" required /></Field>
        <Field label="URL slug" hint="Leave blank to generate from the name."><TextInput value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} /></Field>
        <Field label="Technology group"><select className="admin-select" value={draft.group} onChange={(event) => onChange({ ...draft, group: event.target.value })}><option value="core">Core stack</option><option value="ai">AI & automation</option></select></Field>
        <Field label="Icon key" hint="Optional identifier used by the public interface."><TextInput value={draft.icon_key} onChange={(event) => onChange({ ...draft, icon_key: event.target.value })} placeholder="e.g. atom" /></Field>
        <Field label="Display order" hint="Lower numbers appear first."><TextInput type="number" min="0" step="1" value={draft.sort_order} onChange={(event) => onChange({ ...draft, sort_order: event.target.value })} /></Field>
      </div>
      <div className="admin-switches"><label className="admin-checkbox-row"><input type="checkbox" checked={draft.published} onChange={(event) => onChange({ ...draft, published: event.target.checked })} /> Publish this technology</label></div>
      <div className="admin-editor-actions"><button type="button" className="admin-secondary-button" onClick={onCancel} disabled={saving}>Cancel</button><button type="submit" className="admin-primary-button" disabled={saving}>{saving ? <LoaderCircle size={17} className="admin-spin" /> : <CheckCircle2 size={17} />}{saving ? 'Saving…' : 'Save technology'}</button></div>
    </form>
  );
}

function StatusBadge({ published }) {
  return <span className={`admin-status admin-status--${published ? 'published' : 'draft'}`}>{published ? <><Eye size={13} /> Published</> : <><EyeOff size={13} /> Draft</>}</span>;
}

function ProjectThumbnail({ imagePath, alt }) {
  const signedUrl = useSignedProjectImage(imagePath);

  return (
    <div className="admin-project-thumb">
      {signedUrl ? <img src={signedUrl} alt={alt || ''} /> : <ImagePlus size={24} />}
    </div>
  );
}

function ProjectList({ projects, technologiesById, onEdit, onDelete, deleting, onCreate }) {
  if (!projects.length) {
    return <EmptyState icon={FolderKanban} title="No portfolio projects yet" action={<button className="admin-primary-button" type="button" onClick={onCreate}><Plus size={17} /> Add the first project</button>}>Add a verified, hosted client project when it is ready to be shown publicly.</EmptyState>;
  }

  return (
    <div className="admin-record-list admin-project-list">
      {projects.map((project) => {
        const technologyLabels = (project.technology_ids || []).map((id) => technologiesById.get(id)?.label).filter(Boolean);
        return (
          <article className="admin-project-card" key={project.id}>
            <ProjectThumbnail imagePath={project.image_path} alt={project.image_alt} />
            <div className="admin-record-main">
              <div className="admin-record-title-row"><h3>{project.title}</h3><StatusBadge published={project.published} />{project.featured ? <span className="admin-featured-chip">Featured</span> : null}</div>
              <p>{project.summary}</p>
              <div className="admin-meta-row"><span>{project.category || 'Uncategorized'}</span>{project.live_url ? <a href={project.live_url} target="_blank" rel="noreferrer">Open live site <ChevronRight size={14} /></a> : <span className="admin-muted">No live URL</span>}</div>
              {technologyLabels.length ? <div className="admin-chip-row">{technologyLabels.map((label) => <span key={label} className="admin-chip">{label}</span>)}</div> : null}
            </div>
            <div className="admin-record-actions">
              <IconButton label={`Edit ${project.title}`} onClick={() => onEdit(project)}><Pencil size={17} /></IconButton>
              <IconButton label={`Delete ${project.title}`} className="admin-icon-button--danger" onClick={() => onDelete(project)} disabled={deleting === project.id}>{deleting === project.id ? <LoaderCircle size={17} className="admin-spin" /> : <Trash2 size={17} />}</IconButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ServiceList({ services, onEdit, onDelete, deleting, onCreate }) {
  if (!services.length) return <EmptyState icon={Wrench} title="No services yet" action={<button className="admin-primary-button" type="button" onClick={onCreate}><Plus size={17} /> Add the first service</button>}>Create the services DevNov currently offers before publishing them.</EmptyState>;
  return <div className="admin-record-list">{services.map((service) => <article className="admin-record-card" key={service.id}><div className="admin-record-main"><div className="admin-record-title-row"><h3>{service.title}</h3><StatusBadge published={service.published} /></div><p>{service.description}</p>{service.capabilities?.length ? <div className="admin-chip-row">{service.capabilities.map((capability) => <span className="admin-chip" key={capability}>{capability}</span>)}</div> : null}</div><div className="admin-record-actions"><IconButton label={`Edit ${service.title}`} onClick={() => onEdit(service)}><Pencil size={17} /></IconButton><IconButton label={`Delete ${service.title}`} className="admin-icon-button--danger" onClick={() => onDelete(service)} disabled={deleting === service.id}>{deleting === service.id ? <LoaderCircle size={17} className="admin-spin" /> : <Trash2 size={17} />}</IconButton></div></article>)}</div>;
}

function TechnologyList({ technologies, onEdit, onDelete, deleting, onCreate }) {
  if (!technologies.length) return <EmptyState icon={Layers3} title="No technologies yet" action={<button className="admin-primary-button" type="button" onClick={onCreate}><Plus size={17} /> Add the first technology</button>}>List the tools and platforms DevNov actually uses in projects.</EmptyState>;
  return <div className="admin-record-list">{technologies.map((technology) => <article className="admin-record-card" key={technology.id}><div className="admin-record-main"><div className="admin-record-title-row"><h3>{technology.label}</h3><StatusBadge published={technology.published} /><span className="admin-group-chip">{technology.group === 'ai' ? 'AI & automation' : 'Core stack'}</span></div><p>{technology.category || 'No category'}</p></div><div className="admin-record-actions"><IconButton label={`Edit ${technology.label}`} onClick={() => onEdit(technology)}><Pencil size={17} /></IconButton><IconButton label={`Delete ${technology.label}`} className="admin-icon-button--danger" onClick={() => onDelete(technology)} disabled={deleting === technology.id}>{deleting === technology.id ? <LoaderCircle size={17} className="admin-spin" /> : <Trash2 size={17} />}</IconButton></div></article>)}</div>;
}

export default function AdminPage({ onExit }) {
  const detectedPasswordAction = passwordActionFromLocation();
  const passwordActionRef = useRef(detectedPasswordAction);
  const [authStatus, setAuthStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [passwordAction, setPasswordAction] = useState(detectedPasswordAction);
  const [passwordDraft, setPasswordDraft] = useState({ password: '', confirmPassword: '' });
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  const [accessError, setAccessError] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [feedback, setFeedback] = useState(null);
  const [projectDraft, setProjectDraft] = useState(null);
  const [projectTechnologyIds, setProjectTechnologyIds] = useState([]);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [removeProjectImage, setRemoveProjectImage] = useState(false);
  const [serviceDraft, setServiceDraft] = useState(null);
  const [technologyDraft, setTechnologyDraft] = useState(null);
  const [saving, setSaving] = useState('');
  const [deleting, setDeleting] = useState('');

  const isConfigured = configured();

  const setPasswordSetupAction = useCallback((action) => {
    const nextAction = action === 'recovery' || action === 'invite' ? action : '';
    passwordActionRef.current = nextAction;
    setPasswordAction(nextAction);
  }, []);

  const technologiesById = useMemo(
    () => new Map(technologies.map((technology) => [technology.id, technology])),
    [technologies],
  );

  const loadContent = useCallback(async () => {
    if (!supabase) return;
    setContentLoading(true);
    setContentError('');

    try {
      const [projectResult, serviceResult, technologyResult] = await Promise.all([
        supabase.from('projects').select('*, project_technologies(technology_id)').order('sort_order', { ascending: true }),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('technologies').select('*').order('sort_order', { ascending: true }),
      ]);

      const errors = [projectResult.error, serviceResult.error, technologyResult.error].filter(Boolean);
      if (errors.length) throw errors[0];

      setProjects((projectResult.data || []).map((project) => ({
        ...project,
        technology_ids: (project.project_technologies || []).map((link) => link.technology_id),
      })));
      setServices(serviceResult.data || []);
      setTechnologies(technologyResult.data || []);
    } catch (error) {
      setContentError(messageFrom(error, 'Portfolio content could not be loaded.'));
    } finally {
      setContentLoading(false);
    }
  }, []);

  const resolveSession = useCallback(async (nextSession, { ignorePasswordAction = false } = {}) => {
    if (!isConfigured || !supabase) {
      setAuthStatus('unconfigured');
      return;
    }

    if (!nextSession?.user) {
      setSession(null);
      setProfile(null);
      setAuthStatus('signed-out');
      return;
    }

    setSession(nextSession);

    if (passwordActionRef.current && !ignorePasswordAction) {
      setProfile(null);
      setAuthStatus('password-setup');
      return;
    }

    setAuthStatus('checking-access');
    setAccessError('');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, role')
        .eq('id', nextSession.user.id)
        .maybeSingle();

      if (error) throw error;
      if (data?.role !== 'admin') {
        setProfile(data || null);
        setAuthStatus('denied');
        return;
      }

      setProfile(data);
      setAuthStatus('ready');
      await loadContent();
    } catch (error) {
      setAccessError(messageFrom(error, 'Your admin role could not be verified.'));
      setAuthStatus('denied');
    }
  }, [isConfigured, loadContent]);

  useEffect(() => {
    if (!isConfigured || !supabase) {
      setAuthStatus('unconfigured');
      return undefined;
    }

    let active = true;

    const bootstrap = async () => {
      const actionFromUrl = passwordActionFromLocation();
      if (actionFromUrl) setPasswordSetupAction(actionFromUrl);
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) {
        setAuthError(messageFrom(error, 'Your session could not be checked.'));
        setAuthStatus('signed-out');
        return;
      }
      await resolveSession(data.session);
    };

    void bootstrap();
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordSetupAction('recovery');
      window.setTimeout(() => {
        if (active) void resolveSession(nextSession);
      }, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [isConfigured, resolveSession, setPasswordSetupAction]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setAuthError('');
    setPasswordResetMessage('');
    if (!credentials.email.trim() || !credentials.password) {
      setAuthError('Enter both your email address and password.');
      return;
    }

    setSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });
      if (error) throw error;
      setCredentials((current) => ({ ...current, password: '' }));
      await resolveSession(data.session);
    } catch (error) {
      setAuthError(messageFrom(error, 'Sign-in failed. Check your details and try again.'));
    } finally {
      setSigningIn(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = credentials.email.trim();
    setAuthError('');
    setPasswordResetMessage('');

    if (!email) {
      setAuthError('Enter your email address first, then choose “Forgot password?”.');
      return;
    }

    setPasswordResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw error;
      setPasswordResetMessage('If this email has an account, a secure reset link is on its way.');
    } catch (error) {
      setAuthError(messageFrom(error, 'The password-reset link could not be sent. Please try again.'));
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setAuthError('');

    if (passwordDraft.password.length < 8) {
      setAuthError('Use a password with at least 8 characters.');
      return;
    }
    if (passwordDraft.password !== passwordDraft.confirmPassword) {
      setAuthError('The passwords do not match.');
      return;
    }

    setPasswordUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordDraft.password });
      if (error) throw error;

      setPasswordSetupAction('');
      clearPasswordActionFromLocation();
      setPasswordDraft({ password: '', confirmPassword: '' });

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      await resolveSession(data.session, { ignorePasswordAction: true });
    } catch (error) {
      setAuthError(messageFrom(error, 'The password could not be saved. Please try again.'));
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setProfile(null);
      setPasswordSetupAction('');
      clearPasswordActionFromLocation();
      setPasswordDraft({ password: '', confirmPassword: '' });
      setPasswordResetMessage('');
      setAuthStatus('signed-out');
      setProjects([]);
      setServices([]);
      setTechnologies([]);
    } catch (error) {
      setAuthError(messageFrom(error, 'Could not sign out. Please try again.'));
    }
  };

  const openProjectEditor = (project = null) => {
    setProjectDraft(toProjectDraft(project));
    setProjectTechnologyIds(project?.technology_ids || []);
    setProjectImageFile(null);
    setRemoveProjectImage(false);
    setFeedback(null);
  };

  const closeProjectEditor = () => {
    setProjectDraft(null);
    setProjectTechnologyIds([]);
    setProjectImageFile(null);
    setRemoveProjectImage(false);
  };

  const toggleProjectTechnology = (id) => {
    setProjectTechnologyIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const uploadProjectImage = async (file, projectId) => {
    if (!file) return null;
    if (!file.type.startsWith('image/')) throw new Error('Choose a valid image file.');
    if (file.size > 8 * 1024 * 1024) throw new Error('The image must be 8 MB or smaller.');

    const imagePath = `${projectId}/${Date.now()}-${safeFileName(file.name)}`;
    const { error } = await supabase.storage.from(PROJECT_MEDIA_BUCKET).upload(imagePath, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    return imagePath;
  };

  const handleProjectSave = async (event) => {
    event.preventDefault();
    if (!projectDraft) return;

    const title = projectDraft.title.trim();
    const summary = projectDraft.summary.trim();
    const category = projectDraft.category.trim();
    const liveUrl = projectDraft.live_url.trim();
    const repositoryUrl = projectDraft.repository_url.trim();

    if (!title || !summary || !category) {
      setFeedback({ kind: 'error', text: 'Add a title, category, and short summary before saving.' });
      return;
    }
    if (!validHttpsUrl(liveUrl) || !validHttpsUrl(repositoryUrl)) {
      setFeedback({ kind: 'error', text: 'Live and repository URLs must use https://.' });
      return;
    }
    if (projectDraft.published && !liveUrl) {
      setFeedback({ kind: 'error', text: 'A published project needs a live URL clients can visit.' });
      return;
    }

    setSaving('project');
    setFeedback(null);
    const projectId = projectDraft.id || crypto.randomUUID();
    const previousImagePath = projectDraft.image_path || null;
    let uploadedImagePath = null;
    let projectSaved = false;

    try {
      let imagePath = removeProjectImage ? null : previousImagePath;
      if (projectImageFile) {
        uploadedImagePath = await uploadProjectImage(projectImageFile, projectId);
        imagePath = uploadedImagePath;
      }

      const payload = {
        slug: slugify(projectDraft.slug || title),
        title,
        summary,
        category,
        challenge: nullable(projectDraft.challenge),
        solution: nullable(projectDraft.solution),
        outcome: nullable(projectDraft.outcome),
        image_path: imagePath,
        image_alt: nullable(projectDraft.image_alt),
        live_url: nullable(liveUrl),
        repository_url: nullable(repositoryUrl),
        featured: Boolean(projectDraft.featured),
        published: Boolean(projectDraft.published),
        sort_order: sortableNumber(projectDraft.sort_order),
      };

      const projectResult = projectDraft.id
        ? await supabase.from('projects').update(payload).eq('id', projectId).select('id').single()
        : await supabase.from('projects').insert({ ...payload, id: projectId }).select('id').single();
      if (projectResult.error) throw projectResult.error;
      projectSaved = true;

      const removeLinks = await supabase.from('project_technologies').delete().eq('project_id', projectId);
      if (removeLinks.error) throw removeLinks.error;
      if (projectTechnologyIds.length) {
        const links = projectTechnologyIds.map((technologyId, index) => ({
          project_id: projectId,
          technology_id: technologyId,
          sort_order: index,
        }));
        const addLinks = await supabase.from('project_technologies').insert(links);
        if (addLinks.error) throw addLinks.error;
      }

      if (previousImagePath && previousImagePath !== imagePath) {
        const { error: deleteImageError } = await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([previousImagePath]);
        if (deleteImageError) console.warn('The old project image could not be removed.', deleteImageError);
      }

      await loadContent();
      closeProjectEditor();
      setFeedback({ kind: 'success', text: projectDraft.id ? 'Project updated.' : 'Project added to the portfolio.' });
    } catch (error) {
      if (!projectSaved && uploadedImagePath) {
        await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([uploadedImagePath]);
      }
      const suffix = projectSaved ? ' The project was saved, but its technology links need attention.' : '';
      setFeedback({ kind: 'error', text: `${messageFrom(error, 'Project could not be saved.')}${suffix}` });
      if (projectSaved) await loadContent();
    } finally {
      setSaving('');
    }
  };

  const handleProjectDelete = async (project) => {
    const approved = window.confirm(`Delete “${project.title}” from the portfolio? This cannot be undone.`);
    if (!approved) return;

    setDeleting(project.id);
    setFeedback(null);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', project.id);
      if (error) throw error;
      if (project.image_path) {
        const { error: imageError } = await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([project.image_path]);
        if (imageError) console.warn('The deleted project image could not be removed.', imageError);
      }
      await loadContent();
      setFeedback({ kind: 'success', text: 'Project deleted.' });
    } catch (error) {
      setFeedback({ kind: 'error', text: messageFrom(error, 'Project could not be deleted.') });
    } finally {
      setDeleting('');
    }
  };

  const openServiceEditor = (service = null) => {
    setServiceDraft(toServiceDraft(service));
    setFeedback(null);
  };

  const handleServiceSave = async (event) => {
    event.preventDefault();
    if (!serviceDraft) return;
    const title = serviceDraft.title.trim();
    const description = serviceDraft.description.trim();
    if (!title || !description) {
      setFeedback({ kind: 'error', text: 'Add a service title and description before saving.' });
      return;
    }

    setSaving('service');
    setFeedback(null);
    try {
      const payload = {
        slug: slugify(serviceDraft.slug || title),
        title,
        description,
        capabilities: serviceDraft.capabilities_text.split(/[\n,]/).map((item) => item.trim()).filter(Boolean),
        icon_key: nullable(serviceDraft.icon_key),
        published: Boolean(serviceDraft.published),
        sort_order: sortableNumber(serviceDraft.sort_order),
      };
      const result = serviceDraft.id
        ? await supabase.from('services').update(payload).eq('id', serviceDraft.id)
        : await supabase.from('services').insert(payload);
      if (result.error) throw result.error;
      await loadContent();
      setServiceDraft(null);
      setFeedback({ kind: 'success', text: serviceDraft.id ? 'Service updated.' : 'Service added.' });
    } catch (error) {
      setFeedback({ kind: 'error', text: messageFrom(error, 'Service could not be saved.') });
    } finally {
      setSaving('');
    }
  };

  const handleServiceDelete = async (service) => {
    const approved = window.confirm(`Delete “${service.title}”? This cannot be undone.`);
    if (!approved) return;
    setDeleting(service.id);
    setFeedback(null);
    try {
      const { error } = await supabase.from('services').delete().eq('id', service.id);
      if (error) throw error;
      await loadContent();
      setFeedback({ kind: 'success', text: 'Service deleted.' });
    } catch (error) {
      setFeedback({ kind: 'error', text: messageFrom(error, 'Service could not be deleted.') });
    } finally {
      setDeleting('');
    }
  };

  const openTechnologyEditor = (technology = null) => {
    setTechnologyDraft(toTechnologyDraft(technology));
    setFeedback(null);
  };

  const handleTechnologySave = async (event) => {
    event.preventDefault();
    if (!technologyDraft) return;
    const label = technologyDraft.label.trim();
    const category = technologyDraft.category.trim();
    if (!label || !category) {
      setFeedback({ kind: 'error', text: 'Add a technology name and category before saving.' });
      return;
    }

    setSaving('technology');
    setFeedback(null);
    try {
      const payload = {
        slug: slugify(technologyDraft.slug || label),
        label,
        category,
        group: technologyDraft.group === 'ai' ? 'ai' : 'core',
        icon_key: nullable(technologyDraft.icon_key),
        published: Boolean(technologyDraft.published),
        sort_order: sortableNumber(technologyDraft.sort_order),
      };
      const result = technologyDraft.id
        ? await supabase.from('technologies').update(payload).eq('id', technologyDraft.id)
        : await supabase.from('technologies').insert(payload);
      if (result.error) throw result.error;
      await loadContent();
      setTechnologyDraft(null);
      setFeedback({ kind: 'success', text: technologyDraft.id ? 'Technology updated.' : 'Technology added.' });
    } catch (error) {
      setFeedback({ kind: 'error', text: messageFrom(error, 'Technology could not be saved.') });
    } finally {
      setSaving('');
    }
  };

  const handleTechnologyDelete = async (technology) => {
    const approved = window.confirm(`Delete “${technology.label}”? It will also be removed from linked projects.`);
    if (!approved) return;
    setDeleting(technology.id);
    setFeedback(null);
    try {
      const { error } = await supabase.from('technologies').delete().eq('id', technology.id);
      if (error) throw error;
      await loadContent();
      setFeedback({ kind: 'success', text: 'Technology deleted.' });
    } catch (error) {
      setFeedback({ kind: 'error', text: messageFrom(error, 'Technology could not be deleted.') });
    } finally {
      setDeleting('');
    }
  };

  if (!isConfigured) return <ConfigState />;
  if (authStatus === 'loading' || authStatus === 'checking-access') return <section className="devnov-admin admin-gate"><LoadingState label={authStatus === 'checking-access' ? 'Checking admin access…' : 'Checking your session…'} /></section>;
  if (authStatus === 'password-setup') return <PasswordSetup action={passwordAction} passwordDraft={passwordDraft} onChange={setPasswordDraft} onSubmit={handlePasswordUpdate} loading={passwordUpdating} error={authError} onSignOut={handleSignOut} />;
  if (authStatus === 'signed-out') return <SignIn onSubmit={handleSignIn} credentials={credentials} onChange={setCredentials} loading={signingIn} error={authError} onPasswordReset={handlePasswordReset} passwordResetLoading={passwordResetLoading} passwordResetMessage={passwordResetMessage} />;
  if (authStatus === 'denied') return <AccessDenied onSignOut={handleSignOut} profileError={accessError} retry={() => resolveSession(session)} retrying={authStatus === 'checking-access'} />;

  const tabs = [
    { id: 'projects', label: 'Projects', count: projects.length, icon: FolderKanban },
    { id: 'services', label: 'Services', count: services.length, icon: Wrench },
    { id: 'technologies', label: 'Tech stack', count: technologies.length, icon: Layers3 },
  ];
  const tabMeta = tabs.find((tab) => tab.id === activeTab);
  const editorOpen = Boolean(projectDraft || serviceDraft || technologyDraft);

  return (
    <main className="devnov-admin admin-page">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand-block">
            {onExit ? <button className="admin-back-button" type="button" onClick={onExit}><ArrowLeft size={18} /> Public site</button> : null}
            <div className="admin-brand-title"><span className="admin-brand-mark"><ShieldCheck size={20} /></span><div><p>DevNov</p><h1>Content studio</h1></div></div>
          </div>
          <div className="admin-account-actions">
            <span className="admin-account-name">{profile?.display_name || session?.user?.email || 'Admin'}</span>
            <button className="admin-text-button" type="button" onClick={handleSignOut}><LogOut size={16} /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="admin-shell">
        <aside className="admin-sidebar" aria-label="Content sections">
          <p className="admin-sidebar-label">Manage content</p>
          <nav className="admin-tabs">
            {tabs.map(({ id, label, count, icon: Icon }) => <button key={id} type="button" className={`admin-tab ${activeTab === id ? 'is-active' : ''}`} onClick={() => { setActiveTab(id); setFeedback(null); }}><Icon size={18} /><span>{label}</span><small>{count}</small></button>)}
          </nav>
          <div className="admin-sidebar-help"><ShieldCheck size={18} /><p>Only content marked <strong>Published</strong> appears on the public DevNov site.</p></div>
        </aside>

        <section className="admin-content" aria-live="polite">
          <div className="admin-content-heading">
            <div><p className="admin-eyebrow">Portfolio management</p><h2>{tabMeta.label}</h2><p>{activeTab === 'projects' ? 'Show verified, hosted work that helps clients trust the team.' : activeTab === 'services' ? 'Keep the service offering accurate and current.' : 'Manage the technologies that can be attached to projects.'}</p></div>
            <div className="admin-heading-actions"><button className="admin-secondary-button" type="button" onClick={loadContent} disabled={contentLoading}><RefreshCw size={17} className={contentLoading ? 'admin-spin' : ''} /> Refresh</button><button className="admin-primary-button" type="button" onClick={() => activeTab === 'projects' ? openProjectEditor() : activeTab === 'services' ? openServiceEditor() : openTechnologyEditor()} disabled={editorOpen}><Plus size={17} /> Add {activeTab === 'technologies' ? 'technology' : activeTab.slice(0, -1)}</button></div>
          </div>

          <Notice feedback={feedback} onDismiss={() => setFeedback(null)} />
          {contentError ? <div className="admin-content-error" role="alert"><CircleAlert size={20} /><div><strong>We could not load the content.</strong><p>{contentError}</p></div><button className="admin-secondary-button" type="button" onClick={loadContent}>Try again</button></div> : null}

          {projectDraft ? <ProjectEditor draft={projectDraft} onChange={setProjectDraft} technologies={technologies} selectedTechnologyIds={projectTechnologyIds} onToggleTechnology={toggleProjectTechnology} imageFile={projectImageFile} onImageFile={(file) => { setProjectImageFile(file); if (file) setRemoveProjectImage(false); }} removeCurrentImage={removeProjectImage} onRemoveCurrentImage={setRemoveProjectImage} onSave={handleProjectSave} onCancel={closeProjectEditor} saving={saving === 'project'} /> : null}
          {serviceDraft ? <ServiceEditor draft={serviceDraft} onChange={setServiceDraft} onSave={handleServiceSave} onCancel={() => setServiceDraft(null)} saving={saving === 'service'} /> : null}
          {technologyDraft ? <TechnologyEditor draft={technologyDraft} onChange={setTechnologyDraft} onSave={handleTechnologySave} onCancel={() => setTechnologyDraft(null)} saving={saving === 'technology'} /> : null}

          {contentLoading ? <LoadingState label="Refreshing content…" /> : !contentError ? <>{activeTab === 'projects' ? <ProjectList projects={projects} technologiesById={technologiesById} onEdit={openProjectEditor} onDelete={handleProjectDelete} deleting={deleting} onCreate={() => openProjectEditor()} /> : null}{activeTab === 'services' ? <ServiceList services={services} onEdit={openServiceEditor} onDelete={handleServiceDelete} deleting={deleting} onCreate={() => openServiceEditor()} /> : null}{activeTab === 'technologies' ? <TechnologyList technologies={technologies} onEdit={openTechnologyEditor} onDelete={handleTechnologyDelete} deleting={deleting} onCreate={() => openTechnologyEditor()} /> : null}</> : null}
        </section>
      </div>
    </main>
  );
}
