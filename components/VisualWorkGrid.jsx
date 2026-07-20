const visualWork = [
  ["Branding Projects", "Identity systems, marks, typography, and visual language.", "brand"],
  ["Marketing Campaigns", "Campaign ideas translated into clear, repeatable visual communication.", "campaign"],
  ["Event Posters", "Expressive posters designed to make events feel immediate and recognisable.", "poster"],
  ["Community Design Work", "Design support for IEDC, campus initiatives, and shared creative programmes.", "community"],
];

export default function VisualWorkGrid() {
  return (
    <div className="visual-work-grid">
      {visualWork.map(([title, copy, type], index) => (
        <article className={`visual-work-card visual-work-${type} reveal`} key={title}>
          <span>0{index + 1}</span>
          <div className="visual-work-art" aria-hidden="true">
            <i></i><i></i><i></i>
          </div>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}
