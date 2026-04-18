import React, { useState, useEffect } from "react";

const sections = [
  {
    id: 1,
    title: "Information We Collect",
    icon: "◈",
    content: "We may collect the following information from you:",
    items: ["Full Name", "Phone Number", "Delivery Location"],
  },
  {
    id: 2,
    title: "How We Use Your Information",
    icon: "◉",
    content: "Your information is used exclusively to:",
    items: [
      "Process and deliver your orders",
      "Contact you regarding your order",
      "Provide customer support",
      "Improve our services",
    ],
  },
  {
    id: 3,
    title: "Sharing of Information",
    icon: "◎",
    content:
      "We do not sell or rent your personal information. We may share your information only with:",
    items: [
      "Delivery personnel to complete your order",
      "Advertising platforms such as Facebook or TikTok (for marketing purposes)",
    ],
  },
  {
    id: 4,
    title: "Data Security",
    icon: "◆",
    content:
      "We take reasonable steps to protect your personal information from unauthorized access, loss, or misuse.",
    items: [],
  },
  {
    id: 5,
    title: "Your Rights",
    icon: "◇",
    content:
      "You may request to update or delete your personal information by contacting us at any time.",
    items: [],
  },
  {
    id: 6,
    title: "Contact Us",
    icon: "◈",
    content: "If you have any questions about this Privacy Policy, please reach out:",
    items: ["Business: Alpha Herb", "Phone: +254110771426", "Web: alphaherb.vercel.app"],
  },
];

const PrivacyPolicy = () => {
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

        .pp-root {
          min-height: 100vh;
          background: #0c0c0e;
          color: #e8e3da;
          font-family: 'Cormorant Garamond', Georgia, serif;
          padding: 0 0 80px;
          overflow-x: hidden;
        }

        /* Hero */
        .pp-hero {
          position: relative;
          padding: 80px 48px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .pp-hero.visible { opacity: 1; transform: translateY(0); }

        .pp-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 10% 50%, rgba(180, 148, 90, 0.07) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 80% at 90% 20%, rgba(120, 100, 70, 0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .pp-tag {
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
        .pp-tag::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: #b4945a;
        }

        .pp-title {
          font-size: clamp(48px, 8vw, 88px);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: #f0ebe0;
          margin-bottom: 32px;
        }
        .pp-title em {
          font-style: italic;
          color: #b4945a;
        }

        .pp-meta {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(232, 227, 218, 0.35);
          letter-spacing: 0.12em;
        }

        .pp-brand-line {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-top: 8px;
        }
        .pp-brand {
          font-size: 13px;
          font-weight: 600;
          color: rgba(232, 227, 218, 0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Divider */
        .pp-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 40px 48px 0;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
        }
        .pp-divider.visible { opacity: 1; transform: translateY(0); }
        .pp-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .pp-divider-dot {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(180, 148, 90, 0.4);
          letter-spacing: 0.15em;
        }

        /* Intro */
        .pp-intro {
          padding: 40px 48px;
          max-width: 680px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s;
        }
        .pp-intro.visible { opacity: 1; transform: translateY(0); }
        .pp-intro p {
          font-size: 19px;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(232, 227, 218, 0.7);
          font-style: italic;
        }
        .pp-intro strong { font-weight: 500; color: #e8e3da; font-style: normal; }

        /* Sections grid */
        .pp-grid {
          padding: 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s;
        }
        .pp-grid.visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 680px) {
          .pp-grid { grid-template-columns: 1fr; padding: 0 20px; }
          .pp-hero, .pp-divider, .pp-intro { padding-left: 20px; padding-right: 20px; }
        }

        .pp-section {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          padding: 36px 32px;
          cursor: pointer;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .pp-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180,148,90,0), transparent);
          transition: background 0.3s ease;
        }
        .pp-section:hover::before,
        .pp-section.active::before {
          background: linear-gradient(90deg, transparent, rgba(180,148,90,0.5), transparent);
        }
        .pp-section:hover,
        .pp-section.active {
          background: rgba(180,148,90,0.04);
          border-color: rgba(180,148,90,0.12);
          transform: translateY(-1px);
        }

        .pp-section-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(180,148,90,0.5);
          letter-spacing: 0.15em;
          margin-bottom: 16px;
        }
        .pp-section-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 16px;
        }
        .pp-section-icon {
          font-size: 18px;
          color: #b4945a;
          line-height: 1;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .pp-section-title {
          font-size: 22px;
          font-weight: 400;
          color: #f0ebe0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .pp-section-content {
          font-size: 15px;
          font-weight: 300;
          color: rgba(232,227,218,0.55);
          line-height: 1.7;
          font-style: italic;
          margin-bottom: 16px;
        }
        .pp-section-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pp-section-items li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          font-family: 'DM Mono', monospace;
          font-weight: 300;
          color: rgba(232,227,218,0.65);
          line-height: 1.5;
        }
        .pp-section-items li::before {
          content: '—';
          color: rgba(180,148,90,0.5);
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Footer */
        .pp-footer {
          margin: 40px 48px 0;
          padding: 32px 0 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          opacity: 0;
          transition: opacity 0.7s ease 0.8s;
        }
        .pp-footer.visible { opacity: 1; }

        @media (max-width: 680px) {
          .pp-footer { margin: 40px 20px 0; }
        }

        .pp-footer-brand {
          font-size: 28px;
          font-weight: 300;
          font-style: italic;
          color: rgba(240,235,224,0.3);
          letter-spacing: -0.02em;
        }
        .pp-footer-brand span { color: #b4945a; }

        .pp-footer-link {
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
        .pp-footer-link::before {
          content: '↗';
          font-size: 12px;
        }
        .pp-footer-link:hover { color: #b4945a; }
      `}</style>

      <div className="pp-root">
        {/* Hero */}
        <div className={`pp-hero ${visible ? "visible" : ""}`}>
          <div className="pp-hero-bg" />
          <div className="pp-tag">Legal Document · Privacy</div>
          <h1 className="pp-title">
            Privacy<br />
            <em>Policy</em>
          </h1>
          <div className="pp-meta">
            <div className="pp-brand-line">
              <span className="pp-brand">Alpha Herb</span>
              <span>· Last Updated March 2026</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`pp-divider ${visible ? "visible" : ""}`}>
          <div className="pp-divider-line" />
          <div className="pp-divider-dot">· · ·</div>
          <div className="pp-divider-line" />
        </div>

        {/* Intro */}
        <div className={`pp-intro ${visible ? "visible" : ""}`}>
          <p>
            <strong>Alpha Herb</strong> values your privacy. This Policy explains how we collect,
            use, and protect your information when you interact with our website or place an order.
          </p>
        </div>

        {/* Sections */}
        <div className={`pp-grid ${visible ? "visible" : ""}`}>
          {sections.map((s) => (
            <div
              key={s.id}
              className={`pp-section ${activeSection === s.id ? "active" : ""}`}
              onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
            >
              <div className="pp-section-num">0{s.id}</div>
              <div className="pp-section-header">
                <span className="pp-section-icon">{s.icon}</span>
                <h2 className="pp-section-title">{s.title}</h2>
              </div>
              <p className="pp-section-content">{s.content}</p>
              {s.items.length > 0 && (
                <ul className="pp-section-items">
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
        <div className={`pp-footer ${visible ? "visible" : ""}`}>
          <div className="pp-footer-brand">
            Alpha<span>Herb</span>
          </div>
          <a
            href="https://alphaherb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="pp-footer-link"
          >
            alphaherb.vercel.app
          </a>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;