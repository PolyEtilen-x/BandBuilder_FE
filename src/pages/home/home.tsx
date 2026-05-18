import MainLayout from "@/components/layout/MainLayout/MainLayout";
import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/services/ui/ui.store";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/api/payment.api";
import "./style.css";

/* ── Types ─────────────────────────────────────────── */
interface Stat { value: string; label: string; }
interface Tool { icon: string; title: string; desc: string; tag: string; color: string; }
interface Feature { icon: string; title: string; desc: string; }
interface Step { n: string; title: string; desc: string; }
interface Testimonial { initials: string; name: string; country: string; score: string; text: string; }
interface Plan { name: string; price: string; period: string; features: string[]; popular: boolean; }
interface FaqItem { q: string; a: string; }

/* ── Localized Data Engine ─────────────────────────── */
const getLocalizedData = (lang: "vi" | "en") => {
  const stats = [
    { value: "50K+", label: lang === "vi" ? "Học viên năng động" : "Active Learners" },
    { value: "500+", label: lang === "vi" ? "Đề luyện tập" : "Practice Tests" },
    { value: "4.9★", label: lang === "vi" ? "Đánh giá trung bình" : "Average Rating" },
    { value: "98%", label: lang === "vi" ? "Độ chính xác AI" : "AI Accuracy" },
  ];

  const tools = [
    { icon: "✍️", title: lang === "vi" ? "Huấn Luyện Viết AI" : "AI Writing Coach", tag: lang === "vi" ? "Writing" : "Writing", color: "#f97316", desc: lang === "vi" ? "Nộp bài viết Task 1 & Task 2. AI của chúng tôi sẽ chấm điểm theo cả 4 tiêu chí IELTS và đưa ra gợi ý sửa đổi chi tiết trong vài giây." : "Submit Task 1 & Task 2 essays. Our AI scores them across all 4 IELTS criteria and delivers line-by-line improvement suggestions in seconds." },
    { icon: "🎙️", title: lang === "vi" ? "Trình Giả Lập Nói" : "Speaking Simulator", tag: lang === "vi" ? "Speaking" : "Speaking", color: "#8b5cf6", desc: lang === "vi" ? "Luyện nói các Phần 1, 2 & 3 với giám khảo AI. Nhận nhận xét chi tiết về phát âm, độ trôi chảy, từ vựng và sự mạch lạc." : "Practice Part 1, 2 & 3 with an AI examiner. Receive detailed feedback on pronunciation, fluency, lexical range and coherence." },
    { icon: "📖", title: lang === "vi" ? "Thư Viện Đọc Lâm Sàng" : "Reading Lab", tag: lang === "vi" ? "Reading" : "Reading", color: "#10b981", desc: lang === "vi" ? "Hơn 200 bài đọc học thuật phân loại theo dạng câu hỏi. Mỗi câu trả lời đều đi kèm giải thích và chỉ dẫn nguồn văn bản chi tiết." : "200+ academic passages categorised by question type. Every answer includes a full explanation and passage reference." },
    { icon: "🎧", title: lang === "vi" ? "Luyện Nghe Thực Tế" : "Listening Practice", tag: lang === "vi" ? "Listening" : "Listening", color: "#3b82f6", desc: lang === "vi" ? "Đề thi Nghe IELTS chuẩn hóa trên cả bốn phần. Cung cấp bản dịch đầy đủ, đánh dấu từ khóa theo dòng thời gian sau mỗi bài thi." : "Authentic IELTS-style audio across all four sections. Full transcript, time-stamped highlights and gap-fill analysis after each test." },
    { icon: "🃏", title: lang === "vi" ? "Thẻ Từ Vựng Thông Minh" : "Smart Flashcards", tag: lang === "vi" ? "Vocabulary" : "Vocabulary", color: "#ec4899", desc: lang === "vi" ? "Học từ vựng IELTS phân loại theo chủ đề bằng phương pháp lặp lại ngắt quãng. Hệ thống tự căn chỉnh tần suất ôn tập dựa trên trí nhớ của bạn." : "Topic-grouped IELTS vocabulary with spaced-repetition scheduling. The system auto-adjusts review intervals based on your memory curve." },
    { icon: "📐", title: lang === "vi" ? "Sửa Lỗi Ngữ Pháp" : "Grammar Checker", tag: lang === "vi" ? "Grammar" : "Grammar", color: "#f59e0b", desc: lang === "vi" ? "Dán bất kỳ đoạn văn nào để kiểm tra ngữ pháp ngay lập tức. AI sẽ phát hiện các lỗi sai thường gặp, giải thích quy tắc và viết lại câu hoàn chỉnh cho bạn." : "Paste any paragraph for instant grammar analysis. The AI identifies error patterns, explains the rule and rewrites the sentence for you." },
  ];

  const features = [
    { icon: "🤖", title: lang === "vi" ? "Nhận Xét AI Tức Thì" : "Instant AI Feedback", desc: lang === "vi" ? "Không phải chờ đợi. Nhận điểm số và phân tích nhận xét chi tiết ngay sau khi nộp bài viết, bài nói hay ngữ pháp." : "No waiting. Get a score and detailed commentary the moment you submit — Writing, Speaking or Grammar." },
    { icon: "📊", title: lang === "vi" ? "Bảng Theo Dõi Tiến Trình" : "Progress Dashboard", desc: lang === "vi" ? "Biểu đồ trực quan theo dõi xu hướng điểm số, tổng thời gian học tập và phân tích điểm số các kỹ năng qua từng ngày." : "Visual charts track band score trends, study time and skill breakdowns across every session." },
    { icon: "🎯", title: lang === "vi" ? "Lộ Trình Học Cá Nhân Hóa" : "Personalised Study Path", desc: lang === "vi" ? "Hệ thống tự động phân tích điểm yếu của bạn và đề xuất các bài tập mục tiêu giúp tăng điểm số nhanh nhất." : "Our engine analyses your weak points and recommends the exact exercises that will move your score fastest." },
    { icon: "🔥", title: lang === "vi" ? "Chuỗi Ngày Học & Bảng Xếp Hạng" : "Streaks & Leaderboards", desc: lang === "vi" ? "Tạo lập thói quen học tập hàng ngày, giành huy hiệu thành tích và cạnh tranh trên bảng xếp hạng với bạn bè quốc tế." : "Build daily study habits, earn achievement badges and compete on weekly leaderboards with learners worldwide." },
  ];

  const steps = [
    { n: "01", title: lang === "vi" ? "Làm Bài Đánh Giá Đầu Vào" : "Take a Placement Test", desc: lang === "vi" ? "Bài kiểm tra nhanh 15 phút sẽ chỉ ra trình độ hiện tại của bạn và các kỹ năng còn yếu." : "A 15-minute diagnostic pinpoints your current band level and identifies your weakest sub-skills." },
    { n: "02", title: lang === "vi" ? "Nhận Lộ Trình Học Tập" : "Get Your Study Roadmap", desc: lang === "vi" ? "AI tự động vẽ ra lịch trình học tập từng ngày, nhắm vào những phần giúp bạn tăng điểm số nhanh nhất." : "The AI builds a day-by-day practice schedule targeting your biggest score gains first." },
    { n: "03", title: lang === "vi" ? "Luyện Tập & Chấm Điểm" : "Practice & Get Scored", desc: lang === "vi" ? "Nộp bài làm bất kỳ lúc nào. Nhận phản hồi chấm điểm của AI chỉ trong vài giây kèm bài mẫu tham khảo." : "Submit work any time. AI feedback lands in seconds with scores, highlights and model answer comparisons." },
    { n: "04", title: lang === "vi" ? "Theo Dõi Điểm & Tăng Band" : "Track & Level Up", desc: lang === "vi" ? "Bảng điều khiển cập nhật thời gian thực — theo dõi band điểm IELTS của bạn bứt phá qua từng tuần." : "Your dashboard updates in real time — watch your band score climb week by week with clear milestones." },
  ];

  const testimonials = [
    { initials: "LN", name: "Linh Nguyễn", country: "🇻🇳", score: "Band 7.5", text: lang === "vi" ? "Gia sư viết AI đã chỉ ra các lỗi ngữ pháp lặp đi lặp lại mà tôi mắc phải nhiều tháng trời mà không hề nhận ra. Nhờ vậy điểm viết của tôi tăng từ 6.0 lên 7.5 chỉ trong 3 tháng!" : "The AI Writing coach spotted grammar patterns I had been repeating for months without realising. Went from 6.0 to 7.5 in just 3 months." },
    { initials: "AH", name: "Ahmed Hassan", country: "🇪🇬", score: "Band 8.0", text: lang === "vi" ? "Trình mô phỏng phòng thi Nói giống thật đến kinh ngạc, giúp tôi bước vào phòng thi chính thức với sự tự tin tuyệt đối. Đạt ngay Band 8.0 từ lần thi đầu tiên!" : "Speaking Simulator felt so close to the real exam that I walked into the test centre genuinely relaxed. Scored 8.0 on my very first attempt." },
    { initials: "PS", name: "Priya Sharma", country: "🇮🇳", score: "Band 7.0", text: lang === "vi" ? "Bộ đôi thẻ học từ vựng kết hợp sửa lỗi ngữ pháp là cực kỳ hiệu quả. Tôi có thể học tranh thủ trên điện thoại khi đi tàu điện và điểm số tăng lên rõ rệt." : "Smart Flashcards combined with the Grammar Checker is a killer combo. I study on my phone during commutes and the progress is very real." },
  ];

  const plans = [
    {
      name: lang === "vi" ? "Miễn Phí" : "Free", price: "$0", period: lang === "vi" ? "trọn đời" : "forever", popular: false,
      features: lang === "vi" 
        ? ["10 bài thi thử / tháng", "AI chấm Writing (3 bài / tháng)", "Thẻ từ vựng cơ bản", "Bảng thống kê cá nhân"]
        : ["10 practice tests / month", "AI Writing (3 essays / month)", "Basic flashcard decks", "Personal dashboard"],
    },
    {
      name: "Pro", price: "$15", period: lang === "vi" ? "mỗi tháng" : "per month", popular: true,
      features: lang === "vi"
        ? ["Luyện tập đề thi thử không giới hạn", "Không giới hạn chấm Speaking & Writing", "Đầy đủ bộ sửa ngữ pháp & Flashcard VIP", "Phân tích kỹ năng chuyên sâu", "Lộ trình học tập cá nhân hóa", "Hỗ trợ ưu tiên hàng đầu"]
        : ["Unlimited practice tests", "Unlimited AI Writing & Speaking", "Full Flashcard & Grammar suite", "Deep skill analytics", "Personalised study path", "Priority support"],
    },
    {
      name: lang === "vi" ? "Pro Năm" : "Pro Annual", price: "$11", period: lang === "vi" ? "/ tháng · thanh toán theo năm" : "/ mo · billed yearly", popular: false,
      features: lang === "vi"
        ? ["Bao gồm tất cả quyền lợi gói Pro", "Tiết kiệm 25% so với mua lẻ từng tháng", "Trải nghiệm sớm các tính năng mới", "Xuất báo cáo PDF học tập chuyên nghiệp", "Huy hiệu VIP độc quyền trên hồ sơ"]
        : ["Everything in Pro", "Save 25% vs monthly", "Early access to new features", "Exportable PDF reports", "Exclusive learner badge"],
    },
  ];

  const faqs = [
    { q: lang === "vi" ? "AI chấm điểm IELTS chính xác đến mức nào?" : "How accurate is the AI scoring?", a: lang === "vi" ? "AI của chúng tôi được đào tạo dựa trên hàng ngàn bài thi IELTS thực tế đã chấm điểm bởi giám khảo quốc tế, đảm bảo sai số tối đa chỉ ±0.5 band điểm. Phần thi Nói tập trung đánh giá độ trôi chảy, phát âm, từ vựng và sự mạch lạc." : "Our Writing AI is trained on thousands of examiner-graded scripts and consistently scores within ±0.5 band of certified IELTS examiners. Speaking feedback focuses on fluency, pronunciation and coherence." },
    { q: lang === "vi" ? "Tôi chưa biết gì về IELTS thì có dùng được không?" : "Do I need prior IELTS knowledge?", a: lang === "vi" ? "Hoàn toàn được. Bài kiểm tra đầu vào sẽ giúp hiệu chỉnh hệ thống phù hợp với trình độ của bạn — từ người mới bắt đầu muốn đạt Band 5 cho đến người học nâng cao muốn chinh phục Band 8+." : "Not at all. The placement test calibrates the platform for any level — from complete beginners targeting Band 5 to advanced learners pushing for Band 8+." },
    { q: lang === "vi" ? "BandBuilder có dùng được trên điện thoại không?" : "Can I use BandBuilder on mobile?", a: lang === "vi" ? "Có. BandBuilder được thiết kế tối ưu hóa hiển thị trên mọi thiết bị di động. Các bài tập flashcard và nghe rất thích hợp để bạn tự luyện tập mọi lúc mọi nơi." : "Yes. BandBuilder is fully responsive and works on any device. Flashcards and listening practice are specially optimised for on-the-go sessions." },
    { q: lang === "vi" ? "Có chương trình dùng thử miễn phí cho gói Pro không?" : "Is there a free trial for the Pro plan?", a: lang === "vi" ? "Gói Miễn Phí của chúng tôi cho phép bạn khám phá đầy đủ tính năng với giới hạn sử dụng mỗi tháng. Nâng cấp bất cứ lúc nào, không ràng buộc và hủy chỉ trong 1 click." : "The Free plan lets you explore every feature type with a monthly usage limit. Upgrade to Pro any time with no lock-in — cancel in one click." },
  ];

  return { stats, tools, features, steps, testimonials, plans, faqs };
};

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
  const navigate = useNavigate();
  const { language } = useUIStore();
  return (
    <div className={`plan-card${p.popular ? " plan-popular" : ""}`}>
      {p.popular && <div className="plan-badge">{language === "vi" ? "Phổ Biến Nhất" : "Most Popular"}</div>}
      <div className="plan-name">{p.name}</div>
      <div className="plan-price-row">
        <span className="plan-amount">{p.price}</span>
        <span className="plan-period">{p.period}</span>
      </div>
      <ul className="plan-features">
        {p.features.map((f, i) => <li key={i}><span className="check">✓</span>{f}</li>)}
      </ul>
      <button 
        className={p.popular ? "btn-primary plan-btn" : "btn-outline plan-btn"}
        onClick={() => navigate("/upgrade")}
      >
        {p.price === "$0" ? (language === "vi" ? "Bắt đầu miễn phí" : "Get started free") : (language === "vi" ? "Chọn gói này" : "Choose this plan")}
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
  const { t, language } = useUIStore();
  const [band, setBand] = useState(6.5);
  const navigate = useNavigate();

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
          <div className="hero-eyebrow">{t("home_hero_badge")}</div>
          <h1 className="hero-h1">
            {t("home_hero_title1")}<br />
            <span className="h1-accent">{t("home_hero_title2")}</span>
          </h1>
          <p className="hero-sub">
            {t("home_hero_sub")}
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-lg" onClick={() => navigate("/roadmap")}>
              {t("home_hero_cta_start")}
            </button>
            <button className="btn-ghost btn-lg">
              {t("home_hero_cta_demo")}
            </button>
          </div>
          <div className="hero-trust">
            <span>{t("home_hero_trust")}</span>
            <span className="trust-sep">·</span>
            <span>{language === "vi" ? "Không yêu cầu thẻ tín dụng" : "No credit card required"}</span>
          </div>
        </div>

        <div className="hero-card-wrap">
          <div className="mock-card">
            <div className="mock-titlebar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span className="mock-card-label">{language === "vi" ? "AI Chấm Điểm Writing" : "AI Writing Feedback"}</span>
            </div>
            <div className="mock-overall">
              <span className="mock-overall-label">{language === "vi" ? "Điểm Số Tổng Quan" : "Overall Band Score"}</span>
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
              <span>{language === "vi" ? "Bài viết của bạn thiếu các từ liên kết mạch lạc. Hãy thử dùng furthermore hoặc in contrast để kết nối ý kiến." : "Your sentences lack cohesive devices. Try furthermore or in contrast to link ideas."}</span>
            </div>
            <div className="mock-slider-wrap">
              <input
                type="range" min={4} max={9} step={0.5}
                value={band}
                onChange={e => setBand(parseFloat(e.target.value))}
                className="mock-slider"
              />
              <span className="mock-slider-hint">{language === "vi" ? "← Kéo thanh trượt để xem trước band điểm" : "← Drag to preview band scores"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip({ stats }: { stats: Stat[] }) {
  const { ref, cls } = useFadeIn();
  return (
    <div className="stats-strip" ref={ref}>
      <div className={`container stats-inner ${cls}`}>
        {stats.map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsSection({ tools }: { tools: Tool[] }) {
  const { ref, cls } = useFadeIn();
  const { t } = useUIStore();
  return (
    <section className="section bg-alt" id="tools">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>{t("home_tools_badge")}</Tag>
          <h2>{t("home_tools_title")}</h2>
          <p>{t("home_tools_sub")}</p>
        </div>
        <div className={`tools-grid ${cls}`}>
          {tools.map((t, i) => <ToolCard t={t} key={i} />)}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ features }: { features: Feature[] }) {
  const { ref, cls } = useFadeIn();
  const { t } = useUIStore();
  return (
    <section className="section" id="features">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>{t("home_features_badge")}</Tag>
          <h2>{t("home_features_title")}</h2>
          <p>{t("home_features_sub")}</p>
        </div>
        <div className={`features-grid ${cls}`}>
          {features.map((f, i) => (
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

function HowItWorks({ steps }: { steps: Step[] }) {
  const { ref, cls } = useFadeIn();
  const { t } = useUIStore();
  return (
    <section className="section bg-alt" id="how">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>{t("home_steps_badge")}</Tag>
          <h2>{t("home_steps_title")}</h2>
        </div>
        <div className={`steps-grid ${cls}`}>
          {steps.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { ref, cls } = useFadeIn();
  const { t } = useUIStore();
  return (
    <section className="section" id="testimonials">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>{t("home_testi_badge")}</Tag>
          <h2>{t("home_testi_title")}</h2>
        </div>
        <div className={`testi-grid ${cls}`}>
          {testimonials.map((t, i) => (
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

function PricingSection({ plans }: { plans: Plan[] }) {
  const { ref, cls } = useFadeIn();
  const { t } = useUIStore();
  return (
    <section className="section bg-alt" id="pricing">
      <div className="container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>{t("home_pricing_badge")}</Tag>
          <h2>{t("home_pricing_title")}</h2>
          <p>{t("home_pricing_sub")}</p>
        </div>
        <div className={`plans-grid ${cls}`}>
          {plans.map((p, i) => <PlanCard p={p} key={i} />)}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const { ref, cls } = useFadeIn();
  const { t } = useUIStore();
  return (
    <section className="section" id="faq">
      <div className="container faq-container" ref={ref}>
        <div className={`section-head ${cls}`}>
          <Tag>{t("home_faq_badge")}</Tag>
          <h2>{t("home_faq_title")}</h2>
        </div>
        <div className={`faq-list ${cls}`}>
          {faqs.map((item, i) => <FaqRow item={item} key={i} />)}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  const { ref, cls } = useFadeIn();
  const { t } = useUIStore();
  const navigate = useNavigate();
  return (
    <section className="cta-banner" ref={ref}>
      <div className={`container cta-inner ${cls}`}>
        <h2>{t("home_cta_title")}</h2>
        <p>{t("home_cta_sub")}</p>
        <button className="btn-white btn-lg" onClick={() => navigate("/roadmap")}>
          {t("home_hero_cta_start")}
        </button>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function Home() {
  const { language } = useUIStore();
  const data = getLocalizedData(language);

  // 1. Fetch real packages from Server
  const { data: serverPackages = [] } = useQuery({
    queryKey: ["payment-packages"],
    queryFn: async () => {
      const res = await paymentApi.getPackages()
      return res.data
    },
    staleTime: 1000 * 60 * 10,
  });

  // 2. Map Server packages to landing page pricing structure
  const dynamicPlans = serverPackages.length > 0 ? serverPackages.map((pkg) => {
    return {
      name: pkg.name,
      price: pkg.priceVnd ? pkg.priceVnd.toLocaleString() + " VND" : "0 VND",
      period: language === "vi" ? "trọn gói" : "one-time",
      popular: pkg.name.toLowerCase().includes("pro"),
      features: language === "vi" ? [
        `${pkg.credits} lượt chấm điểm AI cao cấp`,
        "Phân tích phản hồi chi tiết theo tiêu chí IELTS",
        "Trình giả lập Speaking AI tương tác trực tiếp",
        pkg.bonusCredit > 0 ? `Tặng thêm ${pkg.bonusCredit} lượt chấm điểm` : "Không giới hạn cập nhật đề thi thử"
      ] : [
        `${pkg.credits} high-grade AI evaluations`,
        "Deep feedback breakdown on criteria",
        "Realistic interactive Speaking simulator",
        pkg.bonusCredit > 0 ? `Bonus ${pkg.bonusCredit} credits included` : "Access to weekly mock test updates"
      ]
    };
  }) : data.plans;

  return (
    <MainLayout>
      <main className="bb-landing">
        <Hero />
        <StatsStrip stats={data.stats} />
        <ToolsSection tools={data.tools} />
        <FeaturesSection features={data.features} />
        <HowItWorks steps={data.steps} />
        <TestimonialsSection testimonials={data.testimonials} />
        <PricingSection plans={dynamicPlans} />
        <FaqSection faqs={data.faqs} />
        <CtaBanner />
      </main>
    </MainLayout >
  );
}
