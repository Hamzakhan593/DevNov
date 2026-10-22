export default function SectionHeader({ eyebrow, title, description, centered = false, id }) {
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-[740px]`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-4 text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[1.13] tracking-[-0.055em] text-white">{title}</h2>
      {description && <p className={`mt-5 max-w-[640px] text-[15px] leading-8 text-[#aab5c8] sm:text-base ${centered ? 'mx-auto' : ''}`}>{description}</p>}
    </div>
  );
}