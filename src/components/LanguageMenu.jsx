import { Link } from 'react-router-dom'
import './LanguageMenu.css'

const LANGUAGES = [
  {
    id: 'sql',
    name: 'SQL',
    description: 'Practice SQL queries in your browser. Create tables, insert data, and write SELECT queries against a real SQLite engine.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 48 46">
        <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style={{fill:'#863bff',fillOpacity:1}}/>
      </svg>
    ),
  },
  {
    id: 'c',
    name: 'C',
    description: 'Practice C programming in your browser. Write functions, manipulate pointers, and build data structures with guided exercises.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <rect width="40" height="40" rx="6" fill="#2b2b2b"/>
        <text x="20" y="28" textAnchor="middle" fill="#659bd2" fontSize="22" fontFamily="monospace" fontWeight="bold">C</text>
      </svg>
    ),
  },
  {
    id: 'cs',
    name: 'C#',
    description: 'Practice C# programming in your browser. Write classes, use LINQ, build with the full .NET runtime via WebAssembly.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <rect width="40" height="40" rx="6" fill="#68217a"/>
        <text x="20" y="28" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="monospace" fontWeight="bold">C#</text>
      </svg>
    ),
  },
]

export default function LanguageMenu() {
  return (
    <div className="lang-menu">
      <div className="lang-menu__hero">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 46" className="lang-menu__logo">
          <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style={{fill:'#863bff',fillOpacity:1}}/>
        </svg>
        <h1 className="lang-menu__title">Code Practice</h1>
        <p className="lang-menu__subtitle">Choose a language to practice</p>
      </div>

      <div className="lang-menu__cards">
        {LANGUAGES.map((lang) => (
          <Link key={lang.id} to={`/${lang.id}`} className="lang-menu__card">
            <div className="lang-menu__card-icon">{lang.icon}</div>
            <div className="lang-menu__card-body">
              <span className="lang-menu__card-name">{lang.name}</span>
              <p className="lang-menu__card-desc">{lang.description}</p>
            </div>
            <span className="lang-menu__card-action">Start →</span>
          </Link>
        ))}
      </div>

      <p className="lang-menu__footer">More languages planned…</p>
    </div>
  )
}
