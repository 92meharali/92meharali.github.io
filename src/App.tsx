import { QuantumSimulator } from "./components/QuantumSimulator";
import { footerLinks, intro, profile, sections } from "./data/portfolio";

type LinkItem = {
  label: string;
  href?: string;
  note?: string;
};

type Subsection = {
  title: string;
  items?: LinkItem[];
  text?: string;
};

function LinkList({ items }: { items: LinkItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.label}>
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          {item.note && (
            <>
              {" "}
              <span className="item-note">({item.note})</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function SectionBlock({ section }: { section: (typeof sections)[number] }) {
  return (
    <section id={section.id}>
      <h2>{section.title}</h2>
      {section.paragraphs.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
      {section.subsections.map((sub: Subsection) => (
        <div key={sub.title || sub.text?.slice(0, 20) || "list"}>
          {sub.title && <h3>{sub.title}</h3>}
          {sub.text && <p className="coursework">{sub.text}</p>}
          {sub.items && <LinkList items={sub.items} />}
        </div>
      ))}
    </section>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <div className="page-wrap">
      <div className="page">
      <header className="site-header">
        <h1>{profile.name}</h1>
      </header>

      <div className="intro">
        <img
          className="intro-photo"
          src={profile.photo}
          alt={profile.name}
          width={120}
          height={144}
        />
        {intro.paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>

      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}

      <footer className="site-footer">
        <p>
          You can reach me at{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {", "}
          {profile.location}
        </p>
        <p>
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </p>
      </footer>
      </div>
      </div>

      <aside className="game-panel" aria-label="Quantum circuit simulator">
        <QuantumSimulator />
      </aside>
    </div>
  );
}
