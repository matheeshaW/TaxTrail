import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    const NODES = 38;
    const CONNECT_DIST = 160;
    const nodes = [];
    const DATA_LABELS = [
      "LKR 284B", "VAT 18%", "TXN-2024", "Q4 2024",
      "Western", "Central", "Budget", "IRD",
      "LKR 42M", "Revenue", "FY 2024", "Audit",
      "LKR 7.6M", "Approved", "Programs", "Regional",
    ];

    let floats = [];
    const rings = [
      { x: 0.82, y: 0.18, r: 180, speed: 0.0004, phase: 0 },
      { x: 0.12, y: 0.75, r: 120, speed: 0.0006, phase: 1.2 },
      { x: 0.55, y: 0.92, r: 90, speed: 0.0008, phase: 2.4 },
    ];

    let t = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      nodes.length = 0;
      for (let i = 0; i < NODES; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: 1.5 + Math.random() * 1.8,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      floats = DATA_LABELS.map((text) => ({
        text,
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        alpha: 0.03 + Math.random() * 0.06,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#0B1628");
      bg.addColorStop(0.5, "#0d1e35");
      bg.addColorStop(1, "#091320");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const orb1 = ctx.createRadialGradient(W * 0.15, H * 0.45, 0, W * 0.15, H * 0.45, 380);
      orb1.addColorStop(0, "rgba(14,165,160,0.09)");
      orb1.addColorStop(1, "transparent");
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, W, H);

      const orb2 = ctx.createRadialGradient(W * 0.85, H * 0.2, 0, W * 0.85, H * 0.2, 280);
      orb2.addColorStop(0, "rgba(14,165,160,0.055)");
      orb2.addColorStop(1, "transparent");
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, W, H);

      const CELL = 48;
      for (let gx = CELL / 2; gx < W; gx += CELL) {
        for (let gy = CELL / 2; gy < H; gy += CELL) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(14,165,160,0.12)";
          ctx.fill();
        }
      }

      rings.forEach((ring) => {
        const cx = ring.x * W;
        const cy = ring.y * H;
        const pulse = Math.sin(t * ring.speed * 1000 + ring.phase);
        for (let k = 0; k < 3; k++) {
          const rr = ring.r + k * 44 + pulse * 12;
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(14,165,160,${0.055 - k * 0.014})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      ctx.font = "400 11px 'DM Mono', monospace";
      floats.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < -80) f.x = W + 40;
        if (f.x > W + 80) f.x = -40;
        if (f.y < -20) f.y = H + 20;
        if (f.y > H + 20) f.y = -20;
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = "#14C2BC";
        ctx.fillText(f.text, f.x, f.y);
      });
      ctx.globalAlpha = 1;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.pulse += 0.025;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(14,165,160,${(1 - dist / CONNECT_DIST) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const p = 0.5 + 0.5 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.85 + 0.15 * p), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14,165,160,${0.35 + 0.25 * p})`;
        ctx.fill();

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        g.addColorStop(0, `rgba(14,165,160,${0.12 * p})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      const scanY = (((t * 0.00012) % 1) * (H + 200)) - 100;
      const sg = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      sg.addColorStop(0, "transparent");
      sg.addColorStop(0.5, "rgba(14,165,160,0.04)");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 60, W, 120);
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.strokeStyle = "rgba(14,165,160,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      t += 16;
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const onResize = () => {
      resize();
      init();
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form.email, form.password, form.name);
      navigate("/dashboard");
    } catch (err) {
      // Error is already stored in AuthContext for display.
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .tt-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .tt-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 880px;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(14,165,160,0.18);
          box-shadow:
            0 0 0 1px rgba(14,165,160,0.07),
            0 40px 90px rgba(0,0,0,0.65),
            0 0 60px rgba(14,165,160,0.08);
          animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .tt-status-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #0EA5A0 40%, #14C2BC 60%, transparent);
          animation: statusPulse 3s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes statusPulse {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }

        .tt-left {
          width: 42%; flex-shrink: 0;
          background: linear-gradient(148deg, rgba(12,158,153,0.95) 0%, rgba(10,123,119,0.97) 42%, rgba(7,94,91,0.99) 100%);
          padding: 44px 36px;
          display: none;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 860px) { .tt-left { display: flex; } }

        .tt-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 32px 32px;
          animation: gridShift 18s linear infinite;
        }

        @keyframes gridShift {
          from { background-position: 0 0; }
          to   { background-position: 32px 32px; }
        }

        .tt-left::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.055);
          animation: breathe 6s ease-in-out infinite;
        }

        @keyframes breathe {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }

        .tt-brand { position: relative; z-index: 1; }

        .tt-brand-name {
          font-size: 21px; font-weight: 600;
          letter-spacing: -0.025em; color: #fff;
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 10px;
        }

        .tt-brand-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.22);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          animation: iconPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
        }

        @keyframes iconPop {
          from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1) rotate(0); }
        }

        .tt-brand-desc {
          font-size: 13px; color: rgba(255,255,255,0.72);
          line-height: 1.65; font-weight: 300;
        }

        .tt-features {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 10px;
        }

        .tt-feature {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          animation: featureIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
          transition: background 0.2s;
        }

        .tt-feature:hover { background: rgba(255,255,255,0.14); }
        .tt-feature:nth-child(1) { animation-delay: 0.25s; }
        .tt-feature:nth-child(2) { animation-delay: 0.36s; }
        .tt-feature:nth-child(3) { animation-delay: 0.47s; }

        @keyframes featureIn {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .tt-feature-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.65);
          margin-top: 5px; flex-shrink: 0;
          animation: dotPulse 2.5s ease-in-out infinite;
        }
        .tt-feature:nth-child(2) .tt-feature-dot { animation-delay: 0.8s; }
        .tt-feature:nth-child(3) .tt-feature-dot { animation-delay: 1.6s; }

        @keyframes dotPulse {
          0%,100% { opacity: 0.65; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.5); }
        }

        .tt-feature-text { font-size: 12.5px; color: rgba(255,255,255,0.82); line-height: 1.5; }

        .tt-legal {
          position: relative; z-index: 1;
          font-size: 11px; color: rgba(255,255,255,0.32);
          letter-spacing: 0.03em; font-family: 'DM Mono', monospace;
        }

        .tt-right {
          flex: 1;
          background: rgba(11,22,40,0.90);
          padding: 44px 40px;
          display: flex; flex-direction: column; justify-content: center;
          backdrop-filter: blur(16px);
        }

        @media (max-width: 859px) { .tt-right { padding: 36px 26px; } }

        .tt-eyebrow {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #0EA5A0; margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
          animation: fadeUp 0.45s ease both;
        }

        .tt-eyebrow::before {
          content: ''; width: 20px; height: 1px;
          background: #0EA5A0; display: block;
          animation: lineGrow 0.5s ease 0.2s both;
          transform-origin: left;
        }

        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .tt-heading {
          font-size: 25px; font-weight: 600;
          letter-spacing: -0.028em; color: #F7FAFD;
          margin-bottom: 6px;
          animation: fadeUp 0.45s ease 0.07s both;
        }

        .tt-subheading {
          font-size: 13.5px; color: #6B87A8;
          margin-bottom: 32px;
          animation: fadeUp 0.45s ease 0.12s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tt-form {
          display: flex; flex-direction: column; gap: 16px;
          animation: fadeUp 0.45s ease 0.17s both;
        }

        .tt-field { display: flex; flex-direction: column; gap: 6px; }

        .tt-label {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: #6B87A8;
        }

        .tt-input-wrap { position: relative; }

        .tt-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          color: #F7FAFD;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }

        .tt-input::placeholder { color: #2E4A6E; }

        .tt-input:hover {
          border-color: rgba(14,165,160,0.3);
          background: rgba(255,255,255,0.055);
        }

        .tt-input:focus {
          border-color: #0EA5A0;
          box-shadow: 0 0 0 3px rgba(14,165,160,0.18), 0 0 16px rgba(14,165,160,0.08);
          background: rgba(14,165,160,0.04);
        }

        .tt-input-mono { font-family: 'DM Mono', monospace; font-size: 13px; }

        .tt-pass-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #3D5F8A; font-size: 11px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.04em; text-transform: uppercase;
          padding: 4px; transition: color 0.15s;
        }

        .tt-pass-toggle:hover { color: #0EA5A0; }

        .tt-btn {
          width: 100%; padding: 13px;
          border-radius: 10px; border: none;
          background: #0EA5A0; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
          letter-spacing: 0.01em; margin-top: 4px;
          position: relative; overflow: hidden;
        }

        .tt-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }

        .tt-btn:hover:not(:disabled)::before { transform: translateX(100%); }

        .tt-btn:hover:not(:disabled) {
          background: #14C2BC;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(14,165,160,0.4), 0 0 0 1px rgba(14,165,160,0.3);
        }

        .tt-btn:active:not(:disabled) { transform: translateY(0); }
        .tt-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .tt-error {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 11px 14px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.22);
          border-radius: 10px;
          font-size: 13px; color: #fca5a5; line-height: 1.5;
          animation: fadeUp 0.2s ease both;
        }

        .tt-footer {
          margin-top: 24px; font-size: 13px; color: #3D5F8A;
          animation: fadeUp 0.45s ease 0.22s both;
        }

        .tt-link {
          color: #0EA5A0; text-decoration: none; font-weight: 500;
          transition: color 0.15s;
        }

        .tt-link:hover { color: #14C2BC; text-decoration: underline; }
      `}</style>

      <AnimatedBackground />

      <div className="tt-root">
        <div className="tt-card">
          <div className="tt-status-bar" />

          <section className="tt-left">
            <div className="tt-brand">
              <div className="tt-brand-name">
                <div className="tt-brand-icon">⊕</div>
                TaxTrail
              </div>
              <p className="tt-brand-desc">
                Register your workspace access for Sri Lanka public finance analytics and operational planning.
              </p>
            </div>

            <div className="tt-features">
              <div className="tt-feature">
                <div className="tt-feature-dot" />
                <div className="tt-feature-text">Create your operator profile in seconds</div>
              </div>
              <div className="tt-feature">
                <div className="tt-feature-dot" />
                <div className="tt-feature-text">Access tax, social program, and budget modules</div>
              </div>
              <div className="tt-feature">
                <div className="tt-feature-dot" />
                <div className="tt-feature-text">Start analyzing regions with live dashboards</div>
              </div>
            </div>

            <div className="tt-legal">IRD Sri Lanka · Ministry of Finance</div>
          </section>

          <section className="tt-right">
            <div className="tt-eyebrow">Secure Onboarding</div>
            <h1 className="tt-heading">Create your account</h1>
            <p className="tt-subheading">Set up credentials to access the TaxTrail dashboard.</p>

            <form onSubmit={handleSubmit} className="tt-form">
              <div className="tt-field">
                <label className="tt-label">Full Name</label>
                <div className="tt-input-wrap">
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="tt-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="tt-field">
                <label className="tt-label">Email</label>
                <div className="tt-input-wrap">
                  <input
                    type="email"
                    placeholder="you@gov.lk"
                    className="tt-input tt-input-mono"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="tt-field">
                <label className="tt-label">Password</label>
                <div className="tt-input-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="tt-input"
                    style={{ paddingRight: "52px" }}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="tt-pass-toggle"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "hide" : "show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="tt-error">
                  <span style={{ color: "#EF4444", fontSize: "14px", lineHeight: 1.4 }}>✕</span>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="tt-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>

            <div className="tt-footer">
              Already have an account?{" "}
              <Link to="/login" className="tt-link">
                Sign in →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}