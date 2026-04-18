import React, { useState, useEffect } from "react";

const sections = [
  {
    id: 1,
    title: "Use of Our Website",
    icon: "◎",
    content:
      "You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others.",
    items: [],
  },
  {
    id: 2,
    title: "Products & Orders",
    icon: "◈",
    content:
      "We sell herbal products such as Strongman Syrup. All orders are subject to availability and confirmation.",
    items: [
      "Prices may change without notice",
      "We reserve the right to refuse or cancel any order",
    ],
  },
  {
    id: 3,
    title: "Delivery",
    icon: "◉",
    content:
      "We offer delivery within Kenya. Delivery timelines may vary depending on your location.",
    items: [],
  },
  {
    id: 4,
    title: "Payment",
    icon: "◆",
    content:
      "Payment is primarily Cash on Delivery (COD) unless stated otherwise at checkout.",
    items: [],
  },
  {
    id: 5,
    title: "Returns & Refunds",
    icon: "◇",
    content:
      "Due to the nature of our products, returns may not be accepted once the product has been opened.",
    items: [
      "Contact us immediately for damaged or incorrect items",
    ],
  },
  {
    id: 6,
    title: "Limitation of Liability",
    icon: "◈",
    content:
      "We are not liable for any indirect or consequential loss arising from the use of our products or website.",
    items: [],
  },
  {
    id: 7,
    title: "Changes to Terms",
    icon: "◎",
    content:
      "We may update these Terms at any time without prior notice. Continued use of our website constitutes acceptance.",
    items: [],
  },
  {
    id: 8,
    title: "Contact Information",
    icon: "◉",
    content: "For any questions regarding these Terms, please reach out to us directly:",
    items: ["Business: Alpha Herb", "Phone: +254110771426", "Web: alphaherb.vercel.app"],
  },
];

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .tc-root {
          min-height: 100vh;
          background: #0c0c0e;
          color: #e8e3da;
          font-family: 'Cormorant Garamond', Georgia, serif;
          padding: 0 0 80px;
          overflow-x: hidden;
        }

        /* Hero */
        .tc-hero {
          position: relative;
          padding: 80px 48px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .tc-hero.visible { opacity: 1; transform: translateY(0); }

        .tc-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 10% 50%, rgba(180,148,90,0.07) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 80% at 90% 20%, rgba(120,100,70,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .tc-tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b4945a;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tc-tag::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: #b4945a;
        }

        .tc-title {
          font-size: clamp(48px, 8vw, 88px);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: #f0ebe0;
          margin-bottom: 32px;
        }
        .tc-title em {
          font-style: italic;
          color: #b4945a;
        }

        .tc-meta {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(232,227,218,0.35);
          letter-spacing: 0.12em;
        }
        .tc-brand-line {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-top: 8px;
        }
        .tc-brand {
          font-size: 13px;
          font-weight: 600;
          color: rgba(232,227,218,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Divider */
        .tc-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 40px 48px 0;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
        }
        .tc-divider.visible { opacity: 1; transform: translateY(0); }
        .tc-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .tc-divider-dot {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(180,148,90,0.4);
          letter-spacing: 0.15em;
        }

        /* Intro */
        .tc-intro {
          padding: 40px 48px;
          max-width: 680px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s;
        }
        .tc-intro.visible { opacity: 1; transform: translateY(0); }
        .tc-intro p {
          font-size: 19px;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(232,227,218,0.7);
          font-style: italic;
        }
        .tc-intro strong { font-weight: 500; color: #e8e3da; font-style: normal; }

        /* Grid */
        .tc-grid {
          padding: 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s;
        }
        .tc-grid.visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 680px) {
          .tc-grid { grid-template-columns: 1fr; padding: 0 20px; }
          .tc-hero, .tc-divider, .tc-intro { padding-left: 20px; padding-right: 20px; }
        }

        .tc-section {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          padding: 36px 32px;
          cursor: pointer;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .tc-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180,148,90,0), transparent);
          transition: background 0.3s ease;
        }
        .tc-section:hover::before,
        .tc-section.active::before {
          background: linear-gradient(90deg, transparent, rgba(180,148,90,0.5), transparent);
        }
        .tc-section:hover,
        .tc-section.active {
          background: rgba(180,148,90,0.04);
          border-color: rgba(180,148,90,0.12);
          transform: translateY(-1px);
        }

        .tc-section-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(180,148,90,0.5);
          letter-spacing: 0.15em;
          margin-bottom: 16px;
        }
        .tc-section-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 16px;
        }
        .tc-section-icon {
          font-size: 18px;
          color: #b4945a;
          line-height: 1;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .tc-section-title {
          font-size: 22px;
          font-weight: 400;
          color: #f0ebe0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .tc-section-content {
          font-size: 15px;
          font-weight: 300;
          color: rgba(232,227,218,0.55);
          line-height: 1.7;
          font-style: italic;
          margin-bottom: 16px;
        }
        .tc-section-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tc-section-items li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          font-family: 'DM Mono', monospace;
          font-weight: 300;
          color: rgba(232,227,218,0.65);
          line-height: 1.5;
        }
        .tc-section-items li::before {
          content: '—';
          color: rgba(180,148,90,0.5);
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Footer */
        .tc-footer {
          margin: 40px 48px 0;
          padding: 32px 0 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          opacity: 0;
          transition: opacity 0.7s ease 0.9s;
        }
        .tc-footer.visible { opacity: 1; }

        @media (max-width: 680px) {
          .tc-footer { margin: 40px 20px 0; }
        }

        .tc-footer-brand {
          font-size: 28px;
          font-weight: 300;
          font-style: italic;
          color: rgba(240,235,224,0.3);
          letter-spacing: -0.02em;
        }
        .tc-footer-brand span { color: #b4945a; }

        .tc-footer-link {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(180,148,90,0.6);
          text-decoration: none;
          letter-spacing: 0.1em;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tc-footer-link::before { content: '↗'; font-size: 12px; }
        .tc-footer-link:hover { color: #b4945a; }
      `}</style>

      <div className="tc-root">
        {/* Hero */}
        <div className={`tc-hero ${visible ? "visible" : ""}`}>
          <div className="tc-hero-bg" />
          <div className="tc-tag">Legal Document · Terms</div>
          <h1 className="tc-title">
            Terms &<br />
            <em>Conditions</em>
          </h1>
          <div className="tc-meta">
            <div className="tc-brand-line">
              <span className="tc-brand">Alpha Herb</span>
              <span>· Last Updated March 2026</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`tc-divider ${visible ? "visible" : ""}`}>
          <div className="tc-divider-line" />
          <div className="tc-divider-dot">· · ·</div>
          <div className="tc-divider-line" />
        </div>

        {/* Intro */}
        <div className={`tc-intro ${visible ? "visible" : ""}`}>
          <p>
            Welcome to <strong>Alpha Herb</strong>. By accessing or using our website, you agree
            to comply with and be bound by the following Terms and Conditions.
          </p>
        </div>

        {/* Sections */}
        <div className={`tc-grid ${visible ? "visible" : ""}`}>
          {sections.map((s) => (
            <div
              key={s.id}
              className={`tc-section ${activeSection === s.id ? "active" : ""}`}
              onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
            >
              <div className="tc-section-num">0{s.id}</div>
              <div className="tc-section-header">
                <span className="tc-section-icon">{s.icon}</span>
                <h2 className="tc-section-title">{s.title}</h2>
              </div>
              <p className="tc-section-content">{s.content}</p>
              {s.items.length > 0 && (
                <ul className="tc-section-items">
                  {s.items.map((item, i) => (
                    <li key={i}>
                      {item.startsWith("Web:") ? (
                        <a
                          href="https://alphaherb.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#b4945a", textDecoration: "none" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item}
                        </a>
                      ) : item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`tc-footer ${visible ? "visible" : ""}`}>
          <div className="tc-footer-brand">
            Alpha<span>Herb</span>
          </div>
          <a
            href="https://alphaherb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="tc-footer-link"
          >
            alphaherb.vercel.app
          </a>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;