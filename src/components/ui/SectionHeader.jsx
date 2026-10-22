export default function SectionHeader({ eyebrow, title, description, centered = false, id }) {
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-[740px]`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="dev-section-title mt-2.5">{title}</h2>
      {description && <p className={`dev-copy mt-4 max-w-[650px] ${centered ? 'mx-auto' : ''}`}>{description}</p>}
    </div>
  );
}
