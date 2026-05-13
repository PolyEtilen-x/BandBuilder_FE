import MainLayout from "@/components/layout/MainLayout/MainLayout";
import { useState, useEffect, useRef } from "react";
import "./style.css";

/* ── Types ─────────────────────────────────────────── */
interface Stat { value: string; label: string; }
interface Tool { icon: string; title: string; desc: string; tag: string; color: string; }
interface Feature { icon: string; title: string; desc: string; }
interface Step { n: string; title: string; desc: string; }
interface Testimonial { initials: string; name: string; country: string; score: string; text: string; }
interface Plan { name: string; price: string; period: string; features: string[]; popular: boolean; }
interface FaqItem { q: string; a: string; }

/* ── Data ───────────────────────────────────────────── */
const STATS: Stat[] = [
  { value: "50K+", label: "Active Learners" },
  { value: "500+", label: "Practice Tests" },
  { value: "4.9★", label: "Average Rating" },
  { value: "98%", label: "AI Accuracy" },
];

const TOOLS: Tool[] = [
  { icon: "✍️", title: "AI Writing Coach", tag: "Writing", color: "#f97316", desc: "Submit Task 1 & Task 2 essays. Our AI scores them across all 4 IELTS criteria and delivers line-by-line improvement suggestions in seconds." },
  { icon: "🎙️", title: "Speaking Simulator", tag: "Speaking", color: "#8b5cf6", desc: "Practice Part 1, 2 & 3 with an AI examiner. Receive detailed feedback on pronunciation, fluency, lexical range and coherence." },
  { icon: "📖", title: "Reading Lab", tag: "Reading", color: "#10b981", desc: "200+ academic passages categorised by question type. Every answer includes a full explanation and passage reference." },
  { icon: "🎧", title: "Listening Practice", tag: "Listening", color: "#3b82f6", desc: "Authentic IELTS-style audio across all four sections. Full transcript, time-stamped highlights and gap-fill analysis after each test." },
  { icon: "🃏", title: "Smart Flashcards", tag: "Vocabulary", color: "#ec4899", desc: "Topic-grouped IELTS vocabulary with spaced-repetition scheduling. The system auto-adjusts review intervals based on your memory curve." },
  { icon: "📐", title: "Grammar Checker", tag: "Grammar", color: "#f59e0b", desc: "Paste any paragraph for instant grammar analysis. The AI identifies error patterns, explains the rule and rewrites the sentence for you." },
];

const FEATURES: Feature[] = [
  { icon: "🤖", title: "Instant AI Feedback", desc: "No waiting. Get a score and detailed commentary the moment you submit — Writing, Speaking or Grammar." },
  { icon: "📊", title: "Progress Dashboard", desc: "Visual charts track band score trends, study time and skill breakdowns across every session." },
  { icon: "🎯", title: "Personalised Study Path", desc: "Our engine analyses your weak points and recommends the exact exercises that will move your score fastest." },
  { icon: "🔥", title: "Streaks & Leaderboards", desc: "Build daily study habits, earn achievement badges and compete on weekly leaderboards with learners worldwide." },
];

const STEPS: Step[] = [
  { n: "01", title: "Take a Placement Test", desc: "A 15-minute diagnostic pinpoints your current band level and identifies your weakest sub-skills." },
  { n: "02", title: "Get Your Study Roadmap", desc: "The AI builds a day-by-day practice schedule targeting your biggest score gains first." },
  { n: "03", title: "Practice & Get Scored", desc: "Submit work any time. AI feedback lands in seconds with scores, highlights and model answer comparisons." },
  { n: "04", title: "Track & Level Up", desc: "Your dashboard updates in real time — watch your band score climb week by week with clear milestones." },
];

const TESTIMONIALS: Testimonial[] = [
  { initials: "LN", name: "Linh Nguyen", country: "🇻🇳", score: "Band 7.5", text: "The AI Writing coach spotted grammar patterns I had been repeating for months without realising. Went from 6.0 to 7.5 in just 3 months." },
  { initials: "AH", name: "Ahmed Hassan", country: "🇪🇬", score: "Band 8.0", text: "Speaking Simulator felt so close to the real exam that I walked into the test centre genuinely relaxed. Scored 8.0 on my very first attempt." },
  { initials: "PS", name: "Priya Sharma", country: "🇮🇳", score: "Band 7.0", text: "Smart Flashcards combined with the Grammar Checker is a killer combo. I study on my phone during commutes and the progress is very real." },
];

const PLANS: Plan[] = [
  {
    name: "Free", price: "$0", period: "forever", popular: false,
    features: ["10 practice tests / month", "AI Writing (3 essays / month)", "Basic flashcard decks", "Personal dashboard"],
  },
  {
    name: "Pro", price: "$15", period: "per month", popular: true,
    features: ["Unlimited practice tests", "Unlimited AI Writing & Speaking", "Full Flashcard & Grammar suite", "Deep skill analytics", "Personalised study path", "Priority support"],
  },
  {
    name: "Pro Annual", price: "$11", period: "/ mo · billed yearly", popular: false,
    features: ["Everything in Pro", "Save 25% vs monthly", "Early access to new features", "Exportable PDF reports", "Exclusive learner badge"],
  },
];

const FAQS: FaqItem[] = [
  { q: "How accurate is the AI scoring?", a: "Our Writing AI is trained on thousands of examiner-graded scripts and consistently scores within ±0.5 band of certified IELTS examiners. Speaking feedback focuses on fluency, pronunciation and coherence." },
  { q: "Do I need prior IELTS knowledge?", a: "Not at all. The placement test calibrates the platform for any level — from complete beginners targeting Band 5 to advanced learners pushing for Band 8+." },
  { q: "Can I use BandBuilder on mobile?", a: "Yes. BandBuilder is fully responsive and works on any device. Flashcards and listening practice are specially optimised for on-the-go sessions." },
  { q: "Is there a free trial for the Pro plan?", a: "The Free plan lets you explore every feature type with a monthly usage limit. Upgrade to Pro any time with no lock-in — cancel in one click." },
];

/* ── Hook ───────────────────────────────────────────── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, cls: visible ? "fade-in visible" : "fade-in" };
}

/* ── Micro-components ───────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="section-tag">{children}</span>;
}

function ToolCard({ t }: { t: Tool }) {
  return (
    <div className="tool-card">
      <div className="tool-icon-wrap" style={{ background: t.color + "1a", color: t.color }}>{t.icon}</div>
      <div className="tool-body">
        <div className="tool-row">
          <h3 className="tool-title">{t.title}</h3>
          <span className="tool-tag" style={{ background: t.color + "1a", color: t.color }}>{t.tag}</span>
        </div>
        <p className="tool-desc">{t.desc}</p>
      </div>
    </div>
  );
}

function PlanCard({ p }: { p: Plan }) {
  return (
    <div className={`plan-card${p.popular ? " plan-popular" : ""}`}>
      {p.popular && <div className="plan-badge">Most Popular</div>}
      <div className="plan-name">{p.name}</div>
      <div className="plan-price-row">
        <span className="plan-amount">{p.price}</span>
        <span className="plan-period">{p.period}</span>
      </div>
      <ul className="plan-features">
        {p.features.map((f, i) => <li key={i}><span className="check">✓</span>{f}</li>)}
      </ul>
      <button className={p.popular ? "btn-primary plan-btn" : "btn-outline plan-btn"}>
        {p.price === "$0" ? "Get started free" : "Choose this plan"}
      </button>
    </div>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-row${open ? " faq-open" : ""}`} onClick={() => setOpen(o => !o)}>
      <div className="faq-q">
        <span>{item.q}</span>
        <span className="faq-arrow">{open ? "−" : "+"}</span>
      </div>
      {open && <p className="faq-a">{item.a}</p>}
    </div>
  );
}

/* ── Sections ───────────────────────────────────────── */
function Hero() {
  const [band, setBand] = useState(6.5);
  const criteria = [
    { k: "Task Achievement", v: Math.min(band * 0.98, 9) },
    { k: "Coherence", v: Math.min(band * 0.94, 9) },
    { k: "Lexical Resource", v: Math.min(band * 0.90, 9) },
    { k: "Grammatical Range", v: Math.min(band * 0.92, 9) },
  ];
  return (
    <section className="hero">
      <div className="hero-blob b1" />
      <div className="hero-blob b2" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow">🚀 AI-Powered IELTS Preparation</div>
          <h1 className="hero-h1">
            Practice smarter.<br />
            <span className="h1-accent">Reach your band score.</span>
          </h1>
          <p className="hero-sub">
            Writing, Speaking, Reading, Listening — AI scores your work instantly, explains every mistake and builds a study path tailored to you. No tutor needed.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-lg">Start for free →</button>
            <button className="btn-ghost btn-lg">Watch demo</button>
          </div>
          <div className="hero-trust">
            <span>⭐ 4.9 / 5 from 12,000+ reviews</span>
            <span className="trust-sep">·</span>
            <span>No credit card required</span>
          </div>
        </div>

        <div className="hero-card-wrap">
          <div className="mock-card">
            <div className="mock-titlebar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span className="mock-card-label">AI Writing Feedback</span>
            </div>
            <div className="mock-overall">
              <span className="mock-overall-label">Overall Band Score</span>
              <span className="mock-overall-value">{band.toFixed(1)}</span>
            </div>
            {criteria.map(({ k, v }) => (
              <div className="mock-crit" key={k}>
                <div className="mock-crit-row">
                  <span>{k}</span>
                  <span>{v.toFixed(1)}</span>
                </div>
                <div className="mock-bar">
                  <div className="mock-bar-fill" style={{ width: `${(v / 9) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="mock-tip">
              <span className="mock-tip-icon">💡</span>
              <span>Your sentences lack cohesive devices. Try <em>furthermore</em> or <em>in contrast</em> to link ideas.</span>
            </div>
            <div className="mock-slider-wrap">
              <input
                type="range" min={4} max={9} step={0.5}
                value={band}
                onChange={e => setBand(parseFloat(e.target.value))}
                className="mock-slider"
              />
              <span className="mock-slider-hint">← Drag to preview band scores</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const { ref, cls } = useFadeIn();
  return (
    <div className="stats-strip" ref={ref}>
      <div className={`container stats-inner ${cls}`}>
        {STATS.map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsSection() {
  const { ref, cls } = useFadeIn();
  return (
    <section className="section bg-alt" id="tools">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>Practice Tools</Tag>
          <h2>Every skill. One platform.</h2>
          <p>From AI Writing coaching to smart vocabulary flashcards — everything you need to self-study IELTS effectively.</p>
        </div>
        <div className={`tools-grid ${cls}`}>
          {TOOLS.map((t, i) => <ToolCard t={t} key={i} />)}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { ref, cls } = useFadeIn();
  return (
    <section className="section" id="features">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>Why BandBuilder</Tag>
          <h2>Built to move your score fast.</h2>
          <p>Smart feedback loops, adaptive practice and gamified progress tracking — designed around how IELTS scores actually improve.</p>
        </div>
        <div className={`features-grid ${cls}`}>
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { ref, cls } = useFadeIn();
  return (
    <section className="section bg-alt" id="how">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>How It Works</Tag>
          <h2>From sign-up to band score in 4 steps.</h2>
        </div>
        <div className={`steps-grid ${cls}`}>
          {STEPS.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { ref, cls } = useFadeIn();
  return (
    <section className="section" id="testimonials">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>Success Stories</Tag>
          <h2>Real learners. Real results.</h2>
        </div>
        <div className={`testi-grid ${cls}`}>
          {TESTIMONIALS.map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="testi-quote">"</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-footer">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.country} {t.name}</div>
                  <div className="testi-score">{t.score}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { ref, cls } = useFadeIn();
  return (
    <section className="section bg-alt" id="pricing">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>Pricing</Tag>
          <h2>Simple, transparent pricing.</h2>
          <p>Start free, upgrade when you're ready. No hidden fees, cancel any time.</p>
        </div>
        <div className={`plans-grid ${cls}`}>
          {PLANS.map((p, i) => <PlanCard p={p} key={i} />)}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const { ref, cls } = useFadeIn();
  return (
    <section className="section" id="faq">
      <div className="container faq-container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>FAQ</Tag>
          <h2>Common questions answered.</h2>
        </div>
        <div className={`faq-list ${cls}`}>
          {FAQS.map((item, i) => <FaqRow item={item} key={i} />)}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  const { ref, cls } = useFadeIn();
  return (
    <section className="cta-banner" ref={ref}>
      <div className={`container cta-inner ${cls}`}>
        <h2>Ready to hit your target band score?</h2>
        <p>Join 50,000+ learners already training with BandBuilder. Free to start — no credit card required.</p>
        <button className="btn-white btn-lg">Get started for free →</button>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────── */

export default function Home() {
  return (
    <MainLayout>
      <main className="bb-landing">
        <Hero />
        <StatsStrip />
        <ToolsSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </main>
    </MainLayout >
  )
}
