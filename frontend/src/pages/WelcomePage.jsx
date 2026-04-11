import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .ttw-root {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #f7fafd;
          background: linear-gradient(145deg, #091321 0%, #0c1b2f 55%, #08111d 100%);
          position: relative;
          overflow: hidden;
        }

        .ttw-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(20, 194, 188, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 194, 188, 0.07) 1px, transparent 1px);
          background-size: 42px 42px;
          animation: ttw-grid-shift 22s linear infinite;
          pointer-events: none;
        }

        .ttw-blobs::before,
        .ttw-blobs::after {
          content: '';
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          pointer-events: none;
        }

        .ttw-blobs::before {
          width: 420px;
          height: 420px;
          top: -140px;
          right: -90px;
          background: rgba(20, 194, 188, 0.18);
          animation: ttw-drift-a 8s ease-in-out infinite;
        }

        .ttw-blobs::after {
          width: 340px;
          height: 340px;
          left: -110px;
          bottom: -120px;
          background: rgba(56, 189, 248, 0.15);
          animation: ttw-drift-b 10s ease-in-out infinite;
        }

        .ttw-shell {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 28px 18px;
        }

        @media (min-width: 980px) {
          .ttw-shell {
            grid-template-columns: 1.1fr 0.9fr;
            align-items: center;
            padding: 42px 28px;
          }
        }

        .ttw-hero {
          animation: ttw-fade-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .ttw-kicker {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #14c2bc;
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .ttw-kicker::before {
          content: '';
          width: 26px;
          height: 1px;
          background: #14c2bc;
        }

        .ttw-title {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.03em;
          max-width: 720px;
        }

        .ttw-title .accent {
          color: #14c2bc;
        }

        .ttw-sub {
          margin-top: 16px;
          max-width: 620px;
          color: #7f99b9;
          font-size: clamp(0.98rem, 1.5vw, 1.1rem);
          line-height: 1.75;
        }

        .ttw-stats {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 10px;
          max-width: 640px;
        }

        @media (min-width: 640px) {
          .ttw-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .ttw-stat {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          padding: 12px 14px;
          backdrop-filter: blur(10px);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .ttw-stat:hover {
          transform: translateY(-2px);
          border-color: rgba(20, 194, 188, 0.35);
        }

        .ttw-stat strong {
          display: block;
          font-size: 1.15rem;
          letter-spacing: -0.02em;
        }

        .ttw-stat span {
          color: #7f99b9;
          font-size: 0.78rem;
        }

        .ttw-panel {
          border: 1px solid rgba(20, 194, 188, 0.22);
          border-radius: 18px;
          background: rgba(8, 17, 29, 0.86);
          box-shadow: 0 32px 70px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(16px);
          padding: 26px 22px;
          animation: ttw-fade-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
        }

        @media (min-width: 640px) {
          .ttw-panel {
            padding: 32px;
          }
        }

        .ttw-panel h2 {
          font-size: 1.45rem;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .ttw-panel p {
          color: #7f99b9;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .ttw-actions {
          margin-top: 22px;
          display: grid;
          gap: 10px;
        }

        .ttw-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 12px 14px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
          border: 1px solid transparent;
        }

        .ttw-btn.primary {
          background: #14c2bc;
          color: #07111d;
          box-shadow: 0 8px 24px rgba(20, 194, 188, 0.32);
        }

        .ttw-btn.primary:hover {
          background: #22d3cc;
          transform: translateY(-1px);
        }

        .ttw-btn.secondary {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          color: #f7fafd;
        }

        .ttw-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .ttw-note {
          margin-top: 14px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #4f6787;
          letter-spacing: 0.03em;
        }

        @keyframes ttw-grid-shift {
          from { background-position: 0 0; }
          to { background-position: 42px 42px; }
        }

        @keyframes ttw-drift-a {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-16px, 14px); }
        }

        @keyframes ttw-drift-b {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(18px, -12px); }
        }

        @keyframes ttw-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="ttw-root">
        <div className="ttw-grid" />
        <div className="ttw-blobs" />

        <div className="ttw-shell">
          <section className="ttw-hero">
            <p className="ttw-kicker">TaxTrail Platform</p>
            <h1 className="ttw-title">
              Public Finance Intelligence for <span className="accent">Transparent Governance</span>
            </h1>
            <p className="ttw-sub">
              Monitor taxes, social programs, and regional development in one secure workspace built for clarity,
              accountability, and evidence-driven decisions.
            </p>

            <div className="ttw-stats">
              <div className="ttw-stat">
                <strong>2.4M+</strong>
                <span>Tax Records</span>
              </div>
              <div className="ttw-stat">
                <strong>25</strong>
                <span>Districts Covered</span>
              </div>
              <div className="ttw-stat">
                <strong>1,200+</strong>
                <span>Programs Tracked</span>
              </div>
            </div>
          </section>

          <aside className="ttw-panel">
            <h2>Enter The Dashboard</h2>
            <p>
              Sign in with your account or register a new profile to access modules for tax contributions,
              budget allocation, social programs, and regional development analytics.
            </p>

            <div className="ttw-actions">
              <Link to="/login" className="ttw-btn primary">Go to Login →</Link>
              <Link to="/register" className="ttw-btn secondary">Create Account</Link>
            </div>

            <div className="ttw-note">IRD Sri Lanka · Ministry of Finance</div>
          </aside>
        </div>
      </div>
    </>
  );
}