import MainLayout from "@/components/layout/MainLayout/MainLayout";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { Zap, Brain, Map, BarChart3, Star, ArrowRight, CheckCircle, Sparkles, TrendingUp, Users, Target, Award } from "lucide-react";

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────
interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
  size: "large" | "medium" | "small";
  accent: string;
}

interface RoadmapStep {
  band: string;
  label: string;
  description: string;
  duration: string;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
}

interface Testimonial {
  name: string;
  score: string;
  previousScore: string;
  quote: string;
  avatar: string;
  duration: string;
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const features: Feature[] = [
  {
    id: 1,
    icon: <Brain size={28} />,
    title: "AI Chấm bài thông minh",
    description: "Nhận feedback chi tiết về Writing & Speaking nhanh chóng. AI hỗ trợ duyệt từng tiêu chí dễ dàng và bám sát thang điểm.",
    tag: "AI-Powered",
    size: "large",
    accent: "#3B82F6",
  },
  {
    id: 2,
    icon: <Map size={28} />,
    title: "Lộ trình cá nhân hóa",
    description: "Hệ thống hỗ trợ xây dựng kế hoạch học tập linh hoạt dựa trên mục tiêu thực tế của bạn.",
    size: "medium",
    accent: "#60A5FA",
  },
  {
    id: 3,
    icon: <Zap size={28} />,
    title: "Luyện đề thực tế",
    description: "Kho đề phong phú cập nhật đa dạng, hỗ trợ bạn ôn luyện sát với bài thi thực tế.",
    tag: "5,000+ đề",
    size: "small",
    accent: "#93C5FD",
  },
  {
    id: 4,
    icon: <BarChart3 size={28} />,
    title: "Phân tích tiến độ",
    description: "Dashboard trực quan theo dõi từng kỹ năng theo tuần, dự đoán ngày đạt target.",
    size: "small",
    accent: "#C5EEFF",
  },
];

const roadmapSteps: RoadmapStep[] = [
  { band: "4.0–4.5", label: "Khởi đầu", description: "Nắm vững nền tảng ngữ pháp & từ vựng cơ bản", duration: "2–3 tuần" },
  { band: "5.0–5.5", label: "Xây nền", description: "Làm quen format thi, chiến lược từng kỹ năng", duration: "3–4 tuần" },
  { band: "6.0–6.5", label: "Bứt phá", description: "Luyện chuyên sâu, cải thiện tốc độ & accuracy", duration: "4–5 tuần" },
  { band: "7.0–7.5", label: "Đỉnh cao", description: "Tinh chỉnh từng chi tiết, mock test toàn diện", duration: "3–4 tuần" },
  { band: "8.0+", label: "Master", description: "Chinh phục band điểm cao nhất với chiến lược tối ưu", duration: "2–3 tuần" },
];

const stats: StatItem[] = [
  { value: 10000, suffix: "+", label: "Học viên đang luyện thi", icon: <Users size={22} /> },
  { value: 95, suffix: "%", label: "Đạt target band điểm", icon: <Target size={22} /> },
  { value: 4.9, suffix: "/5", label: "Điểm đánh giá trung bình", icon: <Star size={22} /> },
  { value: 30, suffix: "s", label: "Trung bình nhận phản hồi", icon: <Zap size={22} /> },
];

const testimonials: Testimonial[] = [
  {
    name: "Nguyễn Minh Anh",
    score: "7.5",
    previousScore: "5.5",
    quote: "Quá trình ôn thi với BandBuilder rất tiện lợi. Tính năng chấm Writing giúp mình thấy rõ lỗi hay mắc phải.",
    avatar: "MA",
    duration: "3 tháng",
  },
  {
    name: "Trần Đức Huy",
    score: "8.0",
    previousScore: "6.0",
    quote: "Hệ thống vạch ra lộ trình khá chi tiết. Nó chỉ dẫn bài nào nên tập trung ôn học để tiết kiệm thời gian.",
    avatar: "DH",
    duration: "4 tháng",
  },
  {
    name: "Lê Thu Trang",
    score: "7.0",
    previousScore: "5.0",
    quote: "Nền tảng hỗ trợ tôi rèn luyện mỗi ngày. Phân tích điểm yếu khá sát với bài thực hành của tôi.",
    avatar: "TT",
    duration: "90 ngày",
  },
];

// ─────────────────────────────────────────────
// ANIMATED COUNTER HOOK
// ─────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const isDecimal = target % 1 !== 0;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? parseFloat((eased * target).toFixed(1))
        : Math.floor(eased * target);
      setCount(current);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [start, target, duration]);
  return count;
}

// ─────────────────────────────────────────────
// ABSTRACT GROWTH GRAPHIC
// ─────────────────────────────────────────────
function GrowthGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#3B82F6]"
          style={{ width: 180 + i * 80, height: 180 + i * 80 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.15 + (2 - i) * 0.1, 0], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
        />
      ))}

      {/* Central orb */}
      <motion.div
        className="relative w-44 h-44 rounded-full flex items-center justify-center"
        style={{ background: "radial-gradient(circle at 35% 35%, #93C5FD 0%, #3B82F6 50%, #2563EB 100%)" }}
        animate={{ scale: [1, 1.04, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 60%)" }}
        />
        <TrendingUp size={56} className="text-white relative z-10" strokeWidth={1.5} />
      </motion.div>

      {/* Floating score badges */}
      {[
        { label: "Band 7.5", angle: -40, radius: 130, delay: 0 },
        { label: "+2.0", angle: 60, radius: 120, delay: 0.5 },
        { label: "AI Ready", angle: 170, radius: 125, delay: 1 },
      ].map((item, i) => {
        const rad = (item.angle * Math.PI) / 180;
        const x = Math.cos(rad) * item.radius;
        const y = Math.sin(rad) * item.radius;
        return (
          <motion.div
            key={i}
            className="absolute px-3 py-1.5 rounded-full text-xs font-semibold text-[#1E3A8A] backdrop-blur-sm border border-[#3B82F6]/40"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.85)",
              boxShadow: "0 4px 20px rgba(81,207,255,0.2)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ delay: item.delay, duration: 0.5, y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay } }}
          >
            {item.label}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// SVG SCROLL PATH
// ─────────────────────────────────────────────
function ScrollPath({ progress }: { progress: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);

  const drawn = pathLength * progress;

  return (
    <svg viewBox="0 0 120 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ghost path */}
      <path
        d="M60 20 C20 60, 20 100, 60 130 C100 160, 100 200, 60 230 C20 260, 20 300, 60 330 C100 360, 100 370, 60 390"
        stroke="#DBEAFE"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Animated filled path */}
      <path
        ref={pathRef}
        d="M60 20 C20 60, 20 100, 60 130 C100 160, 100 200, 60 230 C20 260, 20 300, 60 330 C100 360, 100 370, 60 390"
        stroke="url(#pathGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength - drawn}
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      {/* Glowing dot at tip */}
      {pathLength > 0 && progress > 0.01 && (
        <motion.circle
          cx={60}
          cy={20 + progress * 370}
          r="6"
          fill="#3B82F6"
          filter="url(#glow)"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`relative overflow-hidden rounded-3xl p-8 md:p-10 border border-white/80 text-center w-full flex flex-col items-center justify-center`}
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(81,207,255,0.08), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Accent top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }} />

      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{ background: feature.accent }}
      />

      <div className="relative z-10 flex flex-col items-center h-full justify-center">
        {feature.tag && (
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 text-[#1E3A8A]"
            style={{ background: "rgba(81,207,255,0.15)", border: "1px solid rgba(81,207,255,0.3)" }}>
            {feature.tag}
          </span>
        )}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-[#3B82F6]"
          style={{ background: "rgba(81,207,255,0.1)" }}>
          {feature.icon}
        </div>
        <h3 className={`font-bold text-gray-800 mb-2 text-xl`}>{feature.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useCountUp(stat.value, 2000, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative rounded-2xl p-6 text-center border border-white/80 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(81,207,255,0.08)",
      }}
    >
      <div className="absolute inset-0 opacity-5"
        style={{ background: "radial-gradient(circle at 50% 0%, #3B82F6, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="text-[#3B82F6] flex justify-center mb-3">{stat.icon}</div>
        <div className="text-4xl font-black text-gray-800 mb-1">
          {count}{stat.suffix}
        </div>
        <p className="text-sm text-gray-500">{stat.label}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: roadmapRef, offset: ["start end", "end start"] });
  const pathProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const [pathValue, setPathValue] = useState(0);

  useEffect(() => {
    return pathProgress.on("change", (v) => setPathValue(v));
  }, [pathProgress]);

  const activeStepIndex = Math.min(
    Math.floor(pathValue * roadmapSteps.length),
    roadmapSteps.length - 1
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
        {/* Google Fonts */}
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap');
            html { scroll-behavior: smooth; }
            * { -webkit-font-smoothing: antialiased; }
            .serif { font-family: 'DM Serif Display', serif; }
        `}</style>

        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center w-full overflow-hidden">
          {/* Background mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-3/5 h-full opacity-10"
              style={{ background: "radial-gradient(ellipse at 80% 20%, #3B82F6 0%, transparent 60%)" }} />
            <div className="absolute bottom-0 left-0 w-2/5 h-1/2 opacity-8"
              style={{ background: "radial-gradient(ellipse at 20% 80%, #93C5FD 0%, transparent 60%)" }} />
            {/* Dot grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#3B82F6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-24 w-full">
            <div className="flex flex-col items-center justify-center text-center w-full">
              {/* Left */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#1E3A8A] mb-8"
                  style={{ background: "rgba(81,207,255,0.12)", border: "1px solid rgba(81,207,255,0.25)" }}
                >
                  <Sparkles size={14} />
                  AI-Powered IELTS Platform #1 Việt Nam
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="serif text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900 leading-[1.05] mb-6"
                >
                  Xây dựng{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10" style={{ color: "#3B82F6" }}>lộ trình</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-3 opacity-20 rounded"
                      style={{ background: "#3B82F6" }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    />
                  </span>
                  {" "}IELTS
                  <br />
                  <em>cá nhân hóa</em>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto"
                >
                  BandBuilder gợi ý bài tập tập trung vào điểm yếu, xây dựng lộ trình luyện thi và hỗ trợ sửa bài bằng AI — cùng bạn nâng trình band điểm một cách bền vững.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center w-full"
                >
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 20px 50px rgba(81,207,255,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-base relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" }}
                  >
                    <span className="relative z-10">Bắt đầu miễn phí</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)" }} />
                  </motion.button>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle size={16} className="text-[#3B82F6]" />
                    Miễn phí 14 ngày · Không cần thẻ
                  </div>
                </motion.div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-3 mt-10"
                >
                  <div className="flex -space-x-2">
                    {["MA", "DH", "TT", "NH"].map((init, i) => (
                      <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white"
                        style={{ background: `hsl(${200 + i * 15}, 80%, ${55 + i * 5}%)` }}>
                        {init}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">10,000+</span>
                    <span className="text-gray-400"> học viên đang tin dùng</span>
                  </div>
                </motion.div>
              </div>

              {/* Right — Growth Graphic */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative h-[360px] w-full hidden md:flex items-center justify-center mt-12 mb-4"
              >
                <GrowthGraphic />
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300"
          >
            <div className="w-px h-12 bg-gradient-to-b from-[#3B82F6] to-transparent" />
          </motion.div>
        </section>

        {/* ── BENTO FEATURES ───────────────────────── */}
        <section className="py-28 px-6 md:px-12 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-[#3B82F6] font-semibold text-sm tracking-widest uppercase mb-4">Tính năng nổi bật</p>
              <h2 className="serif text-4xl md:text-5xl text-gray-900 mb-4">
                Mọi thứ bạn cần để{" "}
                <em style={{ color: "#3B82F6" }}>chinh phục IELTS</em>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-lg">
                Công nghệ AI kết hợp phương pháp học tập khoa học — tạo ra trải nghiệm luyện thi hiệu quả nhất.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 auto-rows-[minmax(260px,auto)] max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard key={feature.id} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ── ROADMAP ─────────────────────────────────── */}
        <section ref={roadmapRef} className="py-28 px-6 md:px-12 w-full flex flex-col items-center justify-center relative">
          <div className="w-full max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-[#3B82F6] font-semibold text-sm tracking-widest uppercase mb-4">Lộ trình học</p>
              <h2 className="serif text-4xl md:text-5xl text-gray-900 mb-4">
                Từng bước nâng cao <em style={{ color: "#3B82F6" }}>band điểm IELTS</em>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-lg">
                Hệ thống sẽ điều chỉnh lộ trình hàng tuần dựa trên sự tiến bộ của bạn.
              </p>
            </motion.div>

            <div className="relative w-full">
              {/* SVG line behind steps */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[120px] hidden md:block pointer-events-none opacity-50 z-0">
                <ScrollPath progress={pathValue} />
              </div>

              {/* Steps Container */}
              <div className="relative z-10 space-y-4 md:space-y-12">
                {/* Vertical line desktop */}
                <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gray-100 rounded-full" />
                {/* Vertical line mobile */}
                <div className="md:hidden absolute left-[19px] top-4 bottom-4 w-1 bg-gray-100 rounded-full" />

                {roadmapSteps.map((step, i) => {
                  const isActive = i <= activeStepIndex;
                  return (
                    <div key={i} className="relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 min-h-[120px]">
                      {/* Left: Step */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className={`w-full md:w-1/2 pl-14 md:pl-0 md:pr-12 md:text-right ${isActive ? "opacity-100" : "opacity-60"}`}
                      >
                        <div className={`p-4 md:p-6 rounded-3xl border transition-all duration-500 bg-white ${isActive ? "border-[#3B82F6]/50 shadow-lg" : "border-gray-100"} flex flex-col items-center justify-center text-center`}>
                          <h3 className="font-bold text-gray-800 text-base md:text-lg mb-2">{step.label} <span className="text-xs md:text-sm font-semibold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded-full ml-1 md:ml-2">{step.band}</span></h3>
                          <p className="text-xs md:text-sm text-gray-500 mb-2">{step.description}</p>
                          <p className="text-[10px] md:text-xs font-medium text-[#3B82F6]">⏱ {step.duration}</p>
                        </div>
                      </motion.div>

                      {/* Center Node */}
                      <div className="absolute left-[0] md:left-1/2 md:-translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center">
                        <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors duration-300 ${isActive ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-gray-200 text-gray-400"}`}>
                          {i < activeStepIndex ? <CheckCircle size={18} /> : i + 1}
                        </motion.div>
                      </div>

                      {/* Right: Achievement */}
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, delay: i * 0.08 + 0.15 }}
                        className={`w-full md:w-1/2 pl-14 md:pl-12 ${isActive ? "opacity-100" : "opacity-40"}`}
                      >
                        <div className={`p-4 md:p-6 rounded-3xl border transition-all duration-500 ${isActive ? "border-blue-200 bg-blue-50/50" : "border-gray-100 bg-gray-50"} flex flex-col items-center justify-center text-center`}>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <Award size={18} className={isActive ? "text-blue-500" : "text-gray-300"} />
                            <span className={`text-xs md:text-sm font-semibold ${isActive ? "text-gray-700" : "text-gray-400"}`}>Thành tích mở khóa</span>
                          </div>
                          <p className={`text-[11px] md:text-sm ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                            {["Hoàn thành Diagnostic Test, nhận lộ trình cá nhân",
                              "Mở khóa 500 bài luyện Listening & Reading cơ bản",
                              "Truy cập AI Writing Checker không giới hạn",
                              "Mock Test toàn diện + phân tích chi tiết từng kỹ năng",
                              "Certificate of Achievement + Tư vấn 1-1 với mentor"][i]}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────── */}
        <section className="py-20 px-6 md:px-12 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="serif text-3xl md:text-4xl text-gray-900">
                Con số nói lên <em style={{ color: "#3B82F6" }}>tất cả</em>
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────── */}
        <section className="py-28 px-6 md:px-12 w-full flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ background: "radial-gradient(ellipse at 30% 50%, #3B82F6, transparent 60%)" }} />

          <div className="w-full max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-[#3B82F6] font-semibold text-sm tracking-widest uppercase mb-4">Học viên nói gì</p>
              <h2 className="serif text-4xl md:text-5xl text-gray-900">
                Thành công <em style={{ color: "#3B82F6" }}>thực sự</em>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="relative rounded-3xl p-7 border border-white/80 overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 12px 40px rgba(81,207,255,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
                    style={{ background: "linear-gradient(90deg, #3B82F6, #93C5FD, transparent)" }} />

                  {/* Score badge */}
                  <div className="flex flex-col items-center text-center mb-6 w-full">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white mb-4 shadow-sm"
                      style={{ background: `hsl(${200 + i * 20}, 80%, 60%)` }}>
                      {t.avatar}
                    </div>
                    <p className="font-semibold text-gray-800 text-lg mb-1">{t.name}</p>
                    <p className="text-sm text-gray-400 mb-4">{t.duration}</p>

                    <div className="flex items-center justify-center gap-3 bg-blue-50 px-4 py-2 rounded-full">
                      <div className="text-sm text-gray-400 line-through">{t.previousScore}</div>
                      <ArrowRight size={14} className="text-[#3B82F6]" />
                      <div className="text-xl font-black" style={{ color: "#3B82F6" }}>{t.score}</div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-1 mb-5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={16} fill="#3B82F6" stroke="none" />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed italic text-center">"{t.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────── */}
        <section className="py-28 px-6 md:px-12 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl p-14 text-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 60%, #0D9FE8 100%)" }}
            >
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
                style={{ background: "white", transform: "translate(30%, -30%)" }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 blur-2xl"
                style={{ background: "white", transform: "translate(-30%, 30%)" }} />

              {/* Grid texture */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="ctaDots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ctaDots)" />
              </svg>

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-4xl mb-4 inline-block"
                >
                  🚀
                </motion.div>
                <h2 className="serif text-4xl md:text-5xl text-white mb-5">
                  Bắt đầu hành trình IELTS
                  <br />
                  <em>ngay hôm nay</em>
                </h2>
                <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                  14 ngày miễn phí. Không cần thẻ tín dụng. Hủy bất cứ lúc nào.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-[#1E3A8A] text-base"
                    style={{ background: "white" }}
                  >
                    Dùng thử miễn phí
                    <ArrowRight size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-base border-2 border-white/40 backdrop-blur-sm"
                  >
                    Xem demo
                  </motion.button>
                </div>

                <p className="text-white/60 text-sm mt-8">
                  Đã có <strong className="text-white">10,000+</strong> học viên tin tưởng — hôm nay là lượt của bạn.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div >
    </MainLayout >
  )
}
