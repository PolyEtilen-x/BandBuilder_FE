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
  | "nav_call_ai"
  | "nav_speaking_coach"
  
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
  
  // Skills & Resources common
  | "skill_speaking"
  | "skill_listening"
  | "skill_reading"
  | "skill_writing"
  | "skill_foundation"
  | "skill_default"
  | "res_video"
  | "res_quiz"
  | "res_practice"
  | "res_reading"

  // HOME PAGE
  | "home_hero_badge"
  | "home_hero_title1"
  | "home_hero_title2"
  | "home_hero_sub"
  | "home_hero_cta_start"
  | "home_hero_cta_demo"
  | "home_hero_trust"
  | "home_stats_learners"
  | "home_stats_tests"
  | "home_stats_rating"
  | "home_stats_accuracy"
  | "home_tools_badge"
  | "home_tools_title"
  | "home_tools_sub"
  | "home_features_badge"
  | "home_features_title"
  | "home_features_sub"
  | "home_steps_badge"
  | "home_steps_title"
  | "home_testi_badge"
  | "home_testi_title"
  | "home_pricing_badge"
  | "home_pricing_title"
  | "home_pricing_sub"
  | "home_faq_badge"
  | "home_faq_title"
  | "home_cta_title"
  | "home_cta_sub"

  // PRACTICE PAGE
  | "practice_title"
  | "practice_loading"
  | "practice_empty"
  | "practice_passage"
  | "practice_section"
  | "practice_task"
  | "practice_part"

  // PROFILE PAGE
  | "profile_loading"
  | "profile_error"
  | "profile_membership_basic"
  | "profile_membership_pro"
  | "profile_credits_rem"
  | "profile_upgrade_btn"
  | "profile_edit_btn"
  | "profile_signout"
  | "profile_stat_tests"
  | "profile_stat_avg"
  | "profile_stat_streak"
  | "profile_stat_hours"
  | "profile_activity_title"
  | "profile_activity_view"
  | "profile_activity_empty"
  | "profile_summary_title"
  | "profile_summary_joined"
  | "profile_summary_sessions"
  | "profile_summary_credits"
  | "profile_upsell_title"
  | "profile_upsell_desc"
  | "profile_upsell_btn"

  // UPGRADE PAGE
  | "upgrade_title"
  | "upgrade_sub"
  | "upgrade_loading"
  | "upgrade_features_eval"
  | "upgrade_features_analysis"
  | "upgrade_features_sim"
  | "upgrade_features_bonus"
  | "upgrade_btn_choose"
  | "upgrade_modal_title"
  | "upgrade_modal_sub"
  | "upgrade_modal_amount"
  | "upgrade_modal_content"
  | "upgrade_modal_bank"
  | "upgrade_modal_waiting"
  | "upgrade_modal_success_title"
  | "upgrade_modal_success_desc"
  | "upgrade_modal_profile_btn"

  // RESULT PAGE
  | "result_back"
  | "result_header_title"
  | "result_score_excellent"
  | "result_score_good"
  | "result_score_keep_trying"
  | "result_score_subtitle"
  | "result_correct"
  | "result_wrong"
  | "result_skipped"
  | "result_perf_by_type"
  | "result_questions"
  | "result_accuracy"
  | "result_analysis"
  | "result_analysis_text"
  | "result_btn_review"
  | "result_btn_more"
  | "result_tip_title"
  | "result_tip_text"

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
    nav_call_ai: "Call with AI",
    nav_speaking_coach: "AI Speaking Coach",

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

    // HOME PAGE (VI)
    home_hero_badge: "🚀 Đào Tạo IELTS Bằng Trí Tuệ Nhân Tạo",
    home_hero_title1: "Luyện Tập Thông Minh.",
    home_hero_title2: "Chinh Phục Điểm Số Mục Tiêu.",
    home_hero_sub: "Luyện cả 4 kỹ năng Nghe, Nói, Đọc, Viết — AI chấm điểm tức thì, chỉ ra chi tiết từng lỗi sai và kiến tạo lộ trình học tối ưu riêng cho bạn mà không cần gia sư.",
    home_hero_cta_start: "Học Miễn Phí Ngay →",
    home_hero_cta_demo: "Xem Video Demo",
    home_hero_trust: "⭐ Đạt 4.9/5 điểm từ hơn 12,000+ học viên",
    home_stats_learners: "Học Viên Đang Học",
    home_stats_tests: "Bài Luyện Tập Đa Dạng",
    home_stats_rating: "Đánh Giá Trung Bình",
    home_stats_accuracy: "Độ Chính Xác AI",
    home_tools_badge: "Công Cụ Luyện Tập",
    home_tools_title: "Trọn bộ kỹ năng. Một nền tảng duy nhất.",
    home_tools_sub: "Từ huấn luyện viết AI đến thẻ học từ vựng thông minh — mang lại mọi thứ bạn cần để tự ôn luyện IELTS hiệu quả nhất.",
    home_features_badge: "Tại Sao Chọn BandBuilder",
    home_features_title: "Thiết kế để bứt tốc điểm số nhanh nhất.",
    home_features_sub: "Vòng phản hồi thông minh, các bài tập thích ứng và tính năng theo dõi tiến trình trực quan giúp tăng band điểm nhanh chóng.",
    home_steps_badge: "Quy Trình Học Tập",
    home_steps_title: "Chinh phục IELTS chỉ với 4 bước đơn giản.",
    home_testi_badge: "Nhận Xét Học Viên",
    home_testi_title: "Học viên thật. Kết quả thật.",
    home_pricing_badge: "Bảng Giá",
    home_pricing_title: "Chi phí rõ ràng, không ẩn số.",
    home_pricing_sub: "Bắt đầu hoàn toàn miễn phí, nâng cấp khi bạn sẵn sàng. Không ràng buộc, hủy bất cứ lúc nào.",
    home_faq_badge: "Hỏi Đáp",
    home_faq_title: "Những thắc mắc thường gặp.",
    home_cta_title: "Sẵn sàng chinh phục band điểm mục tiêu của bạn?",
    home_cta_sub: "Gia nhập hơn 50.000+ học viên đang tiến bộ vượt bậc cùng BandBuilder. Học thử miễn phí, không yêu cầu thẻ tín dụng.",

    // PRACTICE PAGE (VI)
    practice_title: "Học Phần Luyện Tập",
    practice_loading: "Đang tải danh sách bài tập...",
    practice_empty: "Không tìm thấy bài luyện tập nào cho kỹ năng này.",
    practice_passage: "Bài đọc",
    practice_section: "Phần",
    practice_task: "Bài viết",
    practice_part: "Phần nói",

    // PROFILE PAGE (VI)
    profile_loading: "Đang tải hồ sơ học tập của bạn...",
    profile_error: "Không thể tải hồ sơ. Vui lòng tải lại trang hoặc thử lại sau.",
    profile_membership_basic: "Tài Khoản Cơ Bản",
    profile_membership_pro: "Thành Viên Premium VIP",
    profile_credits_rem: "lượt đánh giá AI còn lại",
    profile_upgrade_btn: "Nâng Cấp Pro",
    profile_edit_btn: "Chỉnh Sửa Hồ Sơ",
    profile_signout: "Đăng Xuất",
    profile_stat_tests: "Bài Thi Đã Xong",
    profile_stat_avg: "Điểm Số Trung Bình",
    profile_stat_streak: "Chuỗi Học Tập",
    profile_stat_hours: "Tổng Giờ Học",
    profile_activity_title: "Hoạt Động Gần Đây",
    profile_activity_view: "Xem Lịch Sử",
    profile_activity_empty: "Chưa có hoạt động nào. Hãy bắt đầu luyện tập để thấy tiến trình của bạn!",
    profile_summary_title: "Tóm Tắt Tài Khoản",
    profile_summary_joined: "Tham gia ngày",
    profile_summary_sessions: "Tổng phiên học",
    profile_summary_credits: "Lượt đánh giá đã dùng",
    profile_upsell_title: "Nâng Cấp Premium",
    profile_upsell_desc: "Mở khóa phân tích chuyên sâu, không giới hạn đề thi thử và nhận phản hồi trực tiếp từ AI chuyên nghiệp.",
    profile_upsell_btn: "Tìm Hiểu Thêm",

    // UPGRADE PAGE (VI)
    upgrade_title: "Nâng tầm trải nghiệm BandBuilder của bạn",
    upgrade_sub: "Lựa chọn gói VIP phù hợp nhất để mở khóa toàn bộ sức mạnh công nghệ AI chấm điểm.",
    upgrade_loading: "Đang tải thông tin các gói nâng cấp...",
    upgrade_features_eval: "Lượt đánh giá chấm điểm bằng AI",
    upgrade_features_analysis: "Phân tích chi tiết Writing Task 1 & 2",
    upgrade_features_sim: "Trình giả lập thi Nói Speaking Simulator",
    upgrade_features_bonus: "Tặng kèm lượt đánh giá",
    upgrade_btn_choose: "Bắt Đầu Ngay",
    upgrade_modal_title: "Hoàn Tất Thanh Toán",
    upgrade_modal_sub: "Vui lòng chuyển khoản chính xác số tiền bằng cách quét mã QR hoặc nhập thông tin chi tiết dưới đây.",
    upgrade_modal_amount: "Số tiền:",
    upgrade_modal_content: "Nội dung chuyển khoản:",
    upgrade_modal_bank: "Ngân hàng thụ hưởng:",
    upgrade_modal_waiting: "Hệ thống đang chờ bạn chuyển khoản...",
    upgrade_modal_success_title: "Thanh Toán Thành Công!",
    upgrade_modal_success_desc: "Tài khoản của bạn đã được nâng cấp lên VIP thành công. Bạn đã có toàn quyền trải nghiệm các tính năng cao cấp nhất.",
    upgrade_modal_profile_btn: "Về Trang Cá Nhân",

    // RESULT PAGE (VI)
    result_back: "Quay lại",
    result_header_title: "Kết Quả Luyện Tập",
    result_score_excellent: "Xuất Sắc! 🔥",
    result_score_good: "Làm Tốt Lắm! 👍",
    result_score_keep_trying: "Cố Gắng Lên! 💪",
    result_score_subtitle: "Bạn đã hoàn thành bài thi thử với độ chính xác đạt",
    result_correct: "Đúng",
    result_wrong: "Sai",
    result_skipped: "Bỏ qua",
    result_perf_by_type: "Hiệu Suất Theo Dạng Câu Hỏi",
    result_questions: "câu hỏi",
    result_accuracy: "Chính xác",
    result_analysis: "Phân Tích",
    result_analysis_text: "Hãy xem kỹ lời giải thích chi tiết để hiểu rõ các lỗi sai và bứt phá điểm số ở những lần luyện tập tiếp theo!",
    result_btn_review: "XEM CHI TIẾT ĐÁP ÁN",
    result_btn_more: "LUYỆN TẬP ĐỀ KHÁC",
    result_tip_title: "Lời khuyên dành cho bạn 💡",
    result_tip_text: "Xem lại các câu trả lời sai quan trọng hơn nhiều so với việc làm đề mới. Hãy dành ít nhất 10 phút để đọc kỹ phần giải thích chi tiết."
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
    nav_call_ai: "Call with AI",
    nav_speaking_coach: "AI Speaking Coach",

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

    // HOME PAGE (EN)
    home_hero_badge: "🚀 AI-Powered IELTS Preparation",
    home_hero_title1: "Practice smarter.",
    home_hero_title2: "Reach your band score.",
    home_hero_sub: "Writing, Speaking, Reading, Listening — AI scores your work instantly, explains every mistake and builds a study path tailored to you. No tutor needed.",
    home_hero_cta_start: "Start for free →",
    home_hero_cta_demo: "Watch demo",
    home_hero_trust: "⭐ 4.9 / 5 from 12,000+ reviews",
    home_stats_learners: "Active Learners",
    home_stats_tests: "Practice Tests",
    home_stats_rating: "Average Rating",
    home_stats_accuracy: "AI Accuracy",
    home_tools_badge: "Practice Tools",
    home_tools_title: "Every skill. One platform.",
    home_tools_sub: "From AI Writing coaching to smart vocabulary flashcards — everything you need to self-study IELTS effectively.",
    home_features_badge: "Why BandBuilder",
    home_features_title: "Built to move your score fast.",
    home_features_sub: "Smart feedback loops, adaptive practice and gamified progress tracking — designed around how IELTS scores actually improve.",
    home_steps_badge: "How It Works",
    home_steps_title: "From sign-up to band score in 4 steps.",
    home_testi_badge: "Success Stories",
    home_testi_title: "Real learners. Real results.",
    home_pricing_badge: "Pricing",
    home_pricing_title: "Simple, transparent pricing.",
    home_pricing_sub: "Start free, upgrade when you're ready. No hidden fees, cancel any time.",
    home_faq_badge: "FAQ",
    home_faq_title: "Common questions answered.",
    home_cta_title: "Ready to hit your target band score?",
    home_cta_sub: "Join 50,000+ learners already training with BandBuilder. Free to start — no credit card required.",

    // PRACTICE PAGE (EN)
    practice_title: "Practice Area",
    practice_loading: "Loading practice list...",
    practice_empty: "No practice sessions found for this skill.",
    practice_passage: "Passage",
    practice_section: "Section",
    practice_task: "Task",
    practice_part: "Part",

    // PROFILE PAGE (EN)
    profile_loading: "Loading your profile...",
    profile_error: "Could not load profile. Please try again later.",
    profile_membership_basic: "Basic Plan",
    profile_membership_pro: "Premium VIP Plan",
    profile_credits_rem: "credits remaining",
    profile_upgrade_btn: "Upgrade Pro",
    profile_edit_btn: "Edit Profile",
    profile_signout: "Sign Out",
    profile_stat_tests: "Tests Completed",
    profile_stat_avg: "Avg. Band Score",
    profile_stat_streak: "Study Streak",
    profile_stat_hours: "Total Hours",
    profile_activity_title: "Recent Activity",
    profile_activity_view: "View History",
    profile_activity_empty: "No recent activity found. Start practicing to see your progress!",
    profile_summary_title: "Account Summary",
    profile_summary_joined: "Joined on",
    profile_summary_sessions: "Total Practice",
    profile_summary_credits: "Credits Used",
    profile_upsell_title: "Go Premium",
    profile_upsell_desc: "Unlock detailed analytics, unlimited practice tests, and expert feedback.",
    profile_upsell_btn: "Learn More",

    // UPGRADE PAGE (EN)
    upgrade_title: "Upgrade your BandBuilder experience",
    upgrade_sub: "Choose a plan that fits your IELTS goals and unlock all premium features.",
    upgrade_loading: "Loading packages...",
    upgrade_features_eval: "AI Evaluation Credits",
    upgrade_features_analysis: "Writing Task 1 & 2 Analysis",
    upgrade_features_sim: "Full Speaking Simulator",
    upgrade_features_bonus: "Bonus credits",
    upgrade_btn_choose: "Get Started",
    upgrade_modal_title: "Complete Your Payment",
    upgrade_modal_sub: "Please transfer the exact amount using the QR code or details below.",
    upgrade_modal_amount: "Amount:",
    upgrade_modal_content: "Content:",
    upgrade_modal_bank: "Bank:",
    upgrade_modal_waiting: "Waiting for your payment...",
    upgrade_modal_success_title: "Payment Successful!",
    upgrade_modal_success_desc: "Your account has been upgraded successfully. You can now enjoy all premium features.",
    upgrade_modal_profile_btn: "Go to Profile",

    // RESULT PAGE (EN)
    result_back: "Back",
    result_header_title: "Practice Results",
    result_score_excellent: "Excellent! 🔥",
    result_score_good: "Good Job! 👍",
    result_score_keep_trying: "Keep Trying! 💪",
    result_score_subtitle: "You completed the practice with",
    result_correct: "Correct",
    result_wrong: "Wrong",
    result_skipped: "Skipped",
    result_perf_by_type: "Performance by Question Type",
    result_questions: "questions",
    result_accuracy: "Accuracy",
    result_analysis: "Analysis",
    result_analysis_text: "Review the explanations to understand your mistakes and improve in your next practice session!",
    result_btn_review: "REVIEW EXPLANATION",
    result_btn_more: "PRACTICE MORE",
    result_tip_title: "Tip for you 💡",
    result_tip_text: "Reviewing wrong answers is more important than doing new tasks. Spend at least 10 minutes reading the explanations."
  }
}
