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

    </MainLayout >
  )
}
