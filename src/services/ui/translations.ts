export type TranslationKey = 
  // Navbar
  | "nav_roadmap"
  | "nav_practice"
  | "nav_materials"
  | "nav_vocab"
  | "nav_grammar"
  | "nav_account"
  | "nav_upgrade"
  | "nav_register"
  | "nav_logout"
  
  // Roadmap Onboarding Setup
  | "setup_title"
  | "setup_subtitle"
  | "setup_engine"
  | "setup_select_focus"
  | "setup_ielts_title"
  | "setup_ielts_desc"
  | "setup_general_title"
  | "setup_general_desc"
  | "setup_baseline"
  | "setup_goal"
  | "setup_skills_perf"
  | "setup_speaking"
  | "setup_listening"
  | "setup_reading"
  | "setup_writing"
  | "setup_btn_generate"
  | "setup_generating"
  
  // Roadmap Page
  | "roadmap_back"
  | "roadmap_sub"
  | "roadmap_duration"
  | "roadmap_completion"
  | "roadmap_stages"
  | "roadmap_current_level"
  | "roadmap_target_level"
  | "roadmap_gauge"
  | "roadmap_unlocked"
  | "roadmap_keep_momentum"
  | "roadmap_mastery"
  | "roadmap_currently_focusing"
  | "roadmap_completed_module"
  | "roadmap_core_focus"
  | "roadmap_lessons_resources"
  | "roadmap_launch_practice"
  | "roadmap_review_tasks"
  
  // Skills
  | "skill_speaking"
  | "skill_listening"
  | "skill_reading"
  | "skill_writing"
  | "skill_foundation"
  | "skill_default"
  
  // Resources
  | "res_video"
  | "res_quiz"
  | "res_practice"
  | "res_reading"

export const translations: Record<"vi" | "en", Record<TranslationKey, string>> = {
  vi: {
    nav_roadmap: "Lộ Trình",
    nav_practice: "Luyện Tập",
    nav_materials: "Tài Liệu Học Tập",
    nav_vocab: "Từ Vựng",
    nav_grammar: "Ngữ Pháp",
    nav_account: "Tài Khoản",
    nav_upgrade: "Nâng Cấp VIP",
    nav_register: "Đăng Ký",
    nav_logout: "Đăng Xuất",

    setup_title: "Kiến Tạo Lộ Trình Học",
    setup_subtitle: "Cung cấp thông tin năng lực hiện tại và mục tiêu của bạn để hệ thống AI vẽ nên con đường tối ưu và ngắn nhất.",
    setup_engine: "Hệ Thống Kiến Tạo Lộ Trình v1.0",
    setup_select_focus: "1. Chọn Trọng Tâm Học Tập",
    setup_ielts_title: "IELTS Học Thuật",
    setup_ielts_desc: "Luyện thi tập trung theo band điểm",
    setup_general_title: "Tiếng Anh Giao Tiếp",
    setup_general_desc: "Học giao tiếp theo chuẩn CEFR",
    setup_baseline: "2. Cấp Độ Hiện Tại",
    setup_goal: "3. Điểm Số Mục Tiêu",
    setup_skills_perf: "4. Đánh Giá Trình Độ Từng Kỹ Năng",
    setup_speaking: "Speaking (Nói)",
    setup_listening: "Listening (Nghe)",
    setup_reading: "Reading (Đọc)",
    setup_writing: "Writing (Viết)",
    setup_btn_generate: "Bắt Đầu Kiến Tạo Lộ Trình",
    setup_generating: "Đang tính toán sơ đồ chặng...",

    roadmap_back: "Quay lại danh sách lộ trình",
    roadmap_sub: "Hành Trình Học Tập Thông Minh",
    roadmap_duration: "Thời gian",
    roadmap_completion: "Tỷ lệ hoàn thành",
    roadmap_stages: "Chặng học",
    roadmap_current_level: "Cấp độ hiện tại",
    roadmap_target_level: "Cấp độ mục tiêu",
    roadmap_gauge: "Thước Đo Tiến Trình Học Tập",
    roadmap_unlocked: "Đã mở khóa thành công",
    roadmap_keep_momentum: "Hãy tiếp tục giữ vững phong độ học tập nhé!",
    roadmap_mastery: "Hoàn hảo! Bạn đã chinh phục lộ trình!",
    roadmap_currently_focusing: "Học phần đang tập trung",
    roadmap_completed_module: "Học phần đã hoàn thành",
    roadmap_core_focus: "Trọng Tâm Kiến Thức Cốt Lõi",
    roadmap_lessons_resources: "Tài Liệu Học Tập & Nhiệm Vụ",
    roadmap_launch_practice: "Bắt Đầu Luyện Tập Mục Tiêu",
    roadmap_review_tasks: "Xem Lại Nhiệm Vụ Chặng",

    skill_speaking: "Speaking Focus",
    skill_listening: "Listening Practice",
    skill_reading: "Reading Strategy",
    skill_writing: "Writing Drill",
    skill_foundation: "Core Foundation",
    skill_default: "Skill Module",

    res_video: "Bài Giảng Video",
    res_quiz: "Trắc Nghiệm Tương Tác",
    res_practice: "Bài Luyện Tập",
    res_reading: "Tài Liệu Đọc",
  },
  en: {
    nav_roadmap: "Roadmap",
    nav_practice: "Practice",
    nav_materials: "Materials",
    nav_vocab: "Vocabulary",
    nav_grammar: "Grammar",
    nav_account: "Account",
    nav_upgrade: "Upgrade VIP",
    nav_register: "Register",
    nav_logout: "Logout",

    setup_title: "Map Out Your Journey",
    setup_subtitle: "Answer a few questions to build a personalized study timeline tailored to your current performance and milestone goals.",
    setup_engine: "Band-Architect Engine v1.0",
    setup_select_focus: "1. Select Learning Focus",
    setup_ielts_title: "IELTS Academic",
    setup_ielts_desc: "Target Band Score Focus",
    setup_general_title: "General English",
    setup_general_desc: "CEFR Communication Levels",
    setup_baseline: "2. Current Baseline Level",
    setup_goal: "3. Desired Milestone Goal",
    setup_skills_perf: "4. Specify Current Skill Performance",
    setup_speaking: "Speaking",
    setup_listening: "Listening",
    setup_reading: "Reading",
    setup_writing: "Writing",
    setup_btn_generate: "Generate Personalized Journey Map",
    setup_generating: "Assembling Journey Map...",

    roadmap_back: "Back to Journeys",
    roadmap_sub: "Dynamic Intelligent Journey",
    roadmap_duration: "Duration",
    roadmap_completion: "Completion",
    roadmap_stages: "Stages",
    roadmap_current_level: "Current Level",
    roadmap_target_level: "Goal Target",
    roadmap_gauge: "Journey Progression Gauge",
    roadmap_unlocked: "Unlocked",
    roadmap_keep_momentum: "Keep up the momentum!",
    roadmap_mastery: "Mastery Achieved!",
    roadmap_currently_focusing: "Current Focus Zone",
    roadmap_completed_module: "Completed Module",
    roadmap_core_focus: "Core Focus Area",
    roadmap_lessons_resources: "Learning Material & Tasks",
    roadmap_launch_practice: "Launch Target Practice",
    roadmap_review_tasks: "Review Completed Tasks",

    skill_speaking: "Speaking Focus",
    skill_listening: "Listening Practice",
    skill_reading: "Reading Strategy",
    skill_writing: "Writing Drill",
    skill_foundation: "Core Foundation",
    skill_default: "Skill Module",

    res_video: "Video Lecture",
    res_quiz: "Interactive Quiz",
    res_practice: "Practice Test",
    res_reading: "Reading Material",
  }
}
