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
  | "profile_error_retry"
  | "profile_stat_streak_val"
  | "profile_activity_completed"
  | "profile_summary_sessions_count"

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
  | "upgrade_err_init"
  | "upgrade_copied"
  | "upgrade_popular"

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
  | "result_loading_analyzing"
  | "result_err_data_title"
  | "result_err_data_desc"
  | "result_err_back"
  | "result_writing_title"
  | "result_ai_free"
  | "result_ai_premium"
  | "result_continue"
  | "result_score_impressive"
  | "result_score_perfect"
  | "result_questions_count"
  | "result_rec_title"
  | "result_rec_intro"
  | "result_review_detail_title"
  | "result_review_detail_sub"
  | "result_review_q_label"
  | "result_review_your_ans"
  | "result_review_unanswered"
  | "result_review_correct_label"
  | "result_review_no_answers"
  | "result_upsell_title"
  | "result_upsell_desc"
  | "result_upsell_benefit1"
  | "result_upsell_benefit2"
  | "result_upsell_benefit3"
  | "result_upsell_btn"
  | "result_rec_excel_1"
  | "result_rec_excel_2"
  | "result_rec_excel_3"
  | "result_rec_good_1"
  | "result_rec_good_2"
  | "result_rec_good_3"
  | "result_rec_need_1"
  | "result_rec_need_2"
  | "result_rec_need_3"
  | "sh_back"
  | "sh_session_details"
  | "sh_report_title"
  | "sh_examiner"
  | "sh_overall_band"
  | "sh_excellent"
  | "sh_keep_improving"
  | "sh_criteria_title"
  | "sh_transcript_title"
  | "sh_you"
  | "sh_corrections_title"
  | "sh_err_grammar"
  | "sh_err_vocab"
  | "sh_err_pronun"
  | "sh_you_said"
  | "sh_correction"
  | "sh_no_critical_mistakes"
  | "sh_history_badge"
  | "sh_history_title"
  | "sh_history_desc"
  | "sh_load_error"
  | "sh_empty_title"
  | "sh_empty_desc"
  | "sh_start_practice"
  | "sh_view_details"
  | "explain_rec_perfect"
  | "explain_rec_improve_1"
  | "explain_rec_improve_2"
  | "explain_loading_title"
  | "explain_loading_desc"
  | "explain_error_title"
  | "explain_error_desc"
  | "explain_error_back"
  | "explain_hero_title"
  | "explain_hero_desc"
  | "explain_hero_back"
  | "explain_filter_showing"
  | "explain_filter_all"
  | "explain_filter_incorrect"
  | "explain_filter_correct"
  | "explain_advice_title"
  | "explain_empty_filter"
  | "explain_q_title"
  | "explain_ans_yours"
  | "explain_ans_skipped"
  | "explain_ans_correct"
  | "explain_ai_analysis"
  | "explain_ai_tips"
  | "explain_tx_title"
  | "explain_tx_status"
  | "explain_tx_charged"
  | "explain_tx_free"
  | "explain_summary_title"
  | "explain_summary_mistakes"
  | "explain_summary_correct"
  | "explain_upsell_title"
  | "explain_upsell_desc"
  | "explain_upsell_btn"
  | "explain_footer_back"
  | "practice_err_invalid_id"
  | "practice_err_start"
  | "practice_full_test"

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
    profile_membership_pro: "Thành Viên Premium",
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
    profile_upsell_desc: "Mở khóa kho đề thi khổng lồ, giả lập phòng thi IELTS và được AI phân tích lỗi sai chi tiết từng câu.",
    profile_upsell_btn: "Nâng Cấp Ngay",
    profile_error_retry: "Thử lại",
    profile_stat_streak_val: " Ngày",
    profile_activity_completed: "Hoàn thành",
    profile_summary_sessions_count: "phiên",

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
    upgrade_modal_success_desc: "Gói cước đã được kích hoạt thành công. Cảm ơn bạn!",
    upgrade_modal_profile_btn: "Về trang cá nhân",
    upgrade_err_init: "Không thể khởi tạo thanh toán. Vui lòng thử lại.",
    upgrade_copied: "Đã sao chép vào bộ nhớ tạm!",
    upgrade_popular: "PHỔ BIẾN",

    // RESULT PAGE (VI)
    result_back: "Quay lại",
    result_header_title: "Kết Quả Luyện Tập",
    result_score_excellent: "Xuất Sắc!",
    result_score_good: "Làm Tốt Lắm!",
    result_score_keep_trying: "Cố Gắng Lên!",
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
    result_tip_title: "Mẹo Nhỏ:",
    result_tip_text: "Thay vì làm đề thi liên tục, hãy dành 70% thời gian học của bạn để xem xét lại các câu trả lời sai. Nâng cao chất lượng đánh giá sẽ cải thiện điểm số của bạn nhanh hơn rất nhiều.",
    result_loading_analyzing: "Đang phân tích kết quả...",
    result_err_data_title: "Thiếu Dữ Liệu",
    result_err_data_desc: "Không tìm thấy dữ liệu câu hỏi để tính điểm.",
    result_err_back: "Quay lại Luyện Tập",
    result_writing_title: "Kết Quả IELTS Writing",
    result_ai_free: "Xem giải thích AI (Miễn phí)",
    result_ai_premium: "Giải thích bằng AI (1 Credit)",
    result_continue: "Luyện tập tiếp",
    result_score_impressive: "Bạn đã đạt mức điểm Band Score cực kỳ ấn tượng:",
    result_score_perfect: "độ chính xác hoàn hảo.",
    result_questions_count: "câu hỏi",
    result_rec_title: "Lộ Trình Cải Thiện Cá Nhân Hóa",
    result_rec_intro: "Dựa trên phân tích kết quả bài thi của bạn, Giám khảo AI khuyên bạn nên thực hiện các bước sau:",
    result_review_detail_title: "Xem Đáp Án Chi Tiết",
    result_review_detail_sub: "Nhấp vào nút giải thích AI ở trên đầu trang để nhận phân tích chi tiết của toàn bộ đáp án.",
    result_review_q_label: "Câu hỏi ",
    result_review_your_ans: "Đáp án của bạn: ",
    result_review_unanswered: "Chưa trả lời",
    result_review_correct_label: "Đáp án đúng:",
    result_review_no_answers: "Đáp án chi tiết sẽ được tự động hiển thị khi hoàn tất nộp bài.",
    result_upsell_title: "Bứt Phá Điểm Số Cùng Pro",
    result_upsell_desc: "Mở khóa giải thích AI không giới hạn, phân tích phát âm chuyên sâu từng âm tiết và lộ trình sửa lỗi ngữ pháp tự động.",
    result_upsell_benefit1: "Vô hạn phân tích AI",
    result_upsell_benefit2: "Chữa nói chi tiết 1-1",
    result_upsell_benefit3: "Tối ưu hóa từ vựng nâng band",
    result_upsell_btn: "Nâng Cấp Ngay",
    result_rec_excel_1: "Xuất sắc! Bạn đã làm chủ hoàn toàn kỹ năng này với độ chính xác cực cao.",
    result_rec_excel_2: "Hãy duy trì phong độ bằng cách thử thách các đề thi đầy đủ (Full Practice Tests) dưới áp lực phòng thi thật.",
    result_rec_excel_3: "Xem lại các lỗi sai nhỏ (nếu có) để triệt tiêu hoàn toàn những sơ suất không đáng có.",
    result_rec_good_1: "Kỹ năng nền tảng khá tốt, tuy nhiên bạn vẫn có thể mắc phải các 'bẫy thông tin' (distractors) hoặc hiểu sai ý từ khóa.",
    result_rec_good_2: "Nên tập trung luyện tập lại các dạng câu hỏi có phần trăm chính xác thấp nhất ở bảng dưới.",
    result_rec_good_3: "Sử dụng tính năng 'Giải thích bằng AI' bên dưới để sửa đổi tư duy chọn đáp án.",
    result_rec_need_1: "Kỹ năng hiện tại cần được củng cố kỹ lưỡng hơn về cả từ vựng và phương pháp định vị thông tin.",
    result_rec_need_2: "Hãy học thuộc các bộ từ khóa và đồng nghĩa (synonyms) trước khi tiếp tục làm đề tính giờ.",
    result_rec_need_3: "Kích hoạt 'Giải thích bằng AI' cho các câu sai để nắm rõ lộ trình tư duy giải câu hỏi.",
    sh_back: "Quay lại",
    sh_session_details: "CHI TIẾT LỊCH SỬ",
    sh_report_title: "Báo Cáo IELTS Speaking",
    sh_examiner: "Giám khảo",
    sh_overall_band: "ĐIỂM SỐ CHUNG",
    sh_excellent: "Xuất Sắc",
    sh_keep_improving: "Khá Tốt",
    sh_criteria_title: "Tiêu Chí Chấm Điểm Chi Tiết",
    sh_transcript_title: "Đoạn Hội Thoại & Phát Âm",
    sh_you: "BẠN",
    sh_corrections_title: "Đánh Giá & Nhận Xét Lỗi Sai Từ AI",
    sh_err_grammar: "Lỗi Ngữ Pháp / Cách dùng từ",
    sh_err_vocab: "Nâng Cấp Từ Vựng",
    sh_err_pronun: "Ưu Điểm Phát Âm",
    sh_you_said: "Bạn nói:",
    sh_correction: "Đề xuất sửa:",
    sh_no_critical_mistakes: "Không có lỗi sai nghiêm trọng nào được phát hiện.",
    sh_history_badge: "LỊCH SỬ",
    sh_history_title: "Lịch Sử Luyện Nói Với AI",
    sh_history_desc: "Danh sách các cuộc gọi giả lập IELTS Speaking đã hoàn thành. Hãy bấm vào từng cuộc gọi để xem lại chi tiết bài làm của mình.",
    sh_load_error: "Không thể tải lịch sử luyện nói. Vui lòng thử lại.",
    sh_empty_title: "Chưa Có Lịch Sử Luyện Tập",
    sh_empty_desc: "Bạn chưa thực hiện cuộc gọi nào với Giám khảo AI.",
    sh_start_practice: "Luyện Nói Ngay",
    sh_view_details: "Xem chi tiết",
    explain_rec_perfect: "Hoàn hảo! Bạn đã đạt điểm tuyệt đối. Hãy tiếp tục giải đề khác để duy trì phong độ và phản xạ.",
    explain_rec_improve_1: "Tập trung học phương pháp định vị từ khóa đồng nghĩa (Synonyms/Paraphrasing) được mô tả trong các mẹo tránh bẫy của AI.",
    explain_rec_improve_2: "Phân tích kỹ lưỡng các đáp án gây nhiễu (distractors) để học cách loại trừ triệt để.",
    explain_loading_title: "Đang phân tích sâu bằng Trí Tuệ Nhân Tạo...",
    explain_loading_desc: "Giám khảo AI của BandBuilder đang tổng hợp đề bài, lập đối chiếu ngữ pháp và biên soạn lời giải thích chi tiết cho riêng bạn.",
    explain_error_title: "Không thể tải giải thích",
    explain_error_desc: "Hệ thống gặp sự cố khi gọi AI phân tích. Vui lòng thử lại sau hoặc kiểm tra số dư credit.",
    explain_error_back: "Quay lại",
    explain_hero_title: "Giải Thích Chi Tiết & Giải Thích AI",
    explain_hero_desc: "Phát hiện lỗ hổng ngữ pháp, từ vựng và học hỏi kinh nghiệm làm bài trực tiếp từ Giám khảo AI.",
    explain_hero_back: "Quay lại kết quả",
    explain_filter_showing: "Đang hiển thị",
    explain_filter_all: "Tất cả",
    explain_filter_incorrect: "Câu Sai",
    explain_filter_correct: "Câu Đúng",
    explain_advice_title: "Lời Khuyên Đột Phá Lỗi Sai",
    explain_empty_filter: "Không có câu hỏi nào khớp với bộ lọc hiện tại.",
    explain_q_title: "Câu hỏi:",
    explain_ans_yours: "Bạn chọn:",
    explain_ans_skipped: "Bỏ qua",
    explain_ans_correct: "Đáp án đúng:",
    explain_ai_analysis: "Giải Thích Lỗi Sai Từ Giám Khảo AI",
    explain_ai_tips: "Mẹo tránh bẫy & Chiến lược làm bài",
    explain_tx_title: "Trạng thái giao dịch",
    explain_tx_status: "Trạng thái",
    explain_tx_charged: "Khấu trừ 1 Credit",
    explain_tx_free: "Truy cập miễn phí",
    explain_summary_title: "Thống kê kết quả",
    explain_summary_mistakes: "Lỗi sai cần sửa",
    explain_summary_correct: "Câu chính xác",
    explain_upsell_title: "Bứt Phá Band Điểm",
    explain_upsell_desc: "Mở khóa phân tích chi tiết của 100% câu hỏi và chế độ luyện Nói AI 1-1.",
    explain_upsell_btn: "Nâng Cấp Ngay",
    explain_footer_back: "Quay lại kết quả",
    practice_err_invalid_id: "Lỗi: ID đề thi không hợp lệ. Vui lòng thử đề thi khác.",
    practice_err_start: "Lỗi khi bắt đầu bài thi. Vui lòng thử lại.",
    practice_full_test: "Đề Luyện Thi Đầy Đủ"
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
    profile_membership_basic: "Basic",
    profile_membership_pro: "Premium VIP",
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
    profile_upsell_desc: "Unlock the complete test library, authentic exam simulators and line-by-line AI corrections.",
    profile_upsell_btn: "Upgrade Now",
    profile_error_retry: "Retry",
    profile_stat_streak_val: " Days",
    profile_activity_completed: "Completed",
    profile_summary_sessions_count: "sessions",

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
    upgrade_modal_success_desc: "Your plan has been successfully activated. Thank you!",
    upgrade_modal_profile_btn: "Go to Profile",
    upgrade_err_init: "Failed to initiate payment. Please try again.",
    upgrade_copied: "Copied to clipboard!",
    upgrade_popular: "POPULAR",

    // RESULT PAGE (EN)
    result_back: "Back",
    result_header_title: "Practice Results",
    result_score_excellent: "Excellent!",
    result_score_good: "Good Job!",
    result_score_keep_trying: "Keep Trying!",
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
    result_tip_title: "Quick Tip:",
    result_tip_text: "Instead of grinding mock tests constantly, spend 70% of your study time reviewing your incorrect answers. Quality review beats quantity practice every time.",
    result_loading_analyzing: "Analyzing results...",
    result_err_data_title: "Missing Data",
    result_err_data_desc: "No question data found to calculate score.",
    result_err_back: "Back to Practice",
    result_writing_title: "IELTS Writing Results",
    result_ai_free: "View AI Explanation (Free)",
    result_ai_premium: "Explain with AI (1 Credit)",
    result_continue: "Continue Practice",
    result_score_impressive: "You achieved an impressive Band Score of:",
    result_score_perfect: "perfect accuracy.",
    result_questions_count: "questions",
    result_rec_title: "Personalized Improvement Plan",
    result_rec_intro: "Based on your test session analytics, the AI Examiner recommends following these customized steps:",
    result_review_detail_title: "Detailed Answer Review",
    result_review_detail_sub: "Click the AI explanation button at the top header to parse detailed errors.",
    result_review_q_label: "Question ",
    result_review_your_ans: "Your Answer: ",
    result_review_unanswered: "Not answered",
    result_review_correct_label: "Correct Answer:",
    result_review_no_answers: "Detailed answers will automatically render once submitted successfully.",
    result_upsell_title: "Accelerate Scores with Pro",
    result_upsell_desc: "Unlock unlimited expert AI answer breakdowns, detailed pronunciation AI voice analysis, and automated grammar correction pathways.",
    result_upsell_benefit1: "Unlimited AI analytics",
    result_upsell_benefit2: "1-on-1 speaking feedback",
    result_upsell_benefit3: "Band-boosting vocabulary tools",
    result_upsell_btn: "Upgrade Premium",
    result_rec_excel_1: "Outstanding! You have fully mastered this skill with exceptional accuracy.",
    result_rec_excel_2: "Keep up the momentum by challenging yourself with Full Practice Tests under real exam conditions.",
    result_rec_excel_3: "Review minor slip-ups (if any) to eliminate any remaining careless mistakes.",
    result_rec_good_1: "Your foundation is decent, but you are still prone to information distractors or misinterpreting keywords.",
    result_rec_good_2: "Focus on practicing the specific question types that yielded the lowest accuracy in the metrics below.",
    result_rec_good_3: "Use the 'Explain with AI' feature to correct and refine your answer selection mindset.",
    result_rec_need_1: "Your current skill level requires rigorous reinforcement of both vocabulary and keyword-matching strategies.",
    result_rec_need_2: "Learn essential synonyms and paraphrasing groups before taking more timed quizzes.",
    result_rec_need_3: "Activate 'Explain with AI' on incorrect answers to fully comprehend the logic pathway.",
    sh_back: "Back",
    sh_session_details: "SESSION DETAILS",
    sh_report_title: "IELTS Speaking Report Card",
    sh_examiner: "Examiner",
    sh_overall_band: "OVERALL BAND",
    sh_excellent: "Excellent",
    sh_keep_improving: "Keep Improving",
    sh_criteria_title: "Core Grading Criteria breakdown",
    sh_transcript_title: "Dialogue Transcript & Pronunciation",
    sh_you: "YOU",
    sh_corrections_title: "AI Corrections & Vocabulary Polish",
    sh_err_grammar: "Grammar Correction",
    sh_err_vocab: "Lexical Upgrade",
    sh_err_pronun: "Speech Highlight",
    sh_you_said: "You said:",
    sh_correction: "Correction:",
    sh_no_critical_mistakes: "No critical mistakes detected.",
    sh_history_badge: "HISTORY",
    sh_history_title: "Speaking Practice History",
    sh_history_desc: "Review your completed IELTS speaking simulator sessions. Click on any session to review your detailed feedback.",
    sh_load_error: "Failed to load speaking history. Please retry.",
    sh_empty_title: "No Practice History Yet",
    sh_empty_desc: "You haven't completed any sessions with the AI examiner.",
    sh_start_practice: "Start Practice Now",
    sh_view_details: "View details",
    explain_rec_perfect: "Perfect! You achieved a perfect score. Continue practicing other modules to maintain your speed.",
    explain_rec_improve_1: "Focus on mastering synonym keyword-matching described in the AI pro tips of incorrect answers.",
    explain_rec_improve_2: "Thoroughly analyze structural distractors to learn precise process-of-elimination techniques.",
    explain_loading_title: "Analyzing with deep AI...",
    explain_loading_desc: "BandBuilder's AI Examiner is matching grammar pathways, cross-referencing keys, and drafting customized explanations.",
    explain_error_title: "Failed to load explanation",
    explain_error_desc: "An error occurred while generating AI feedback. Please check your credit balance or try again.",
    explain_error_back: "Go Back",
    explain_hero_title: "AI Answer Explanations",
    explain_hero_desc: "Discover grammar and vocab gaps and master timing strategies directly from the AI Examiner.",
    explain_hero_back: "Back to Results",
    explain_filter_showing: "Showing",
    explain_filter_all: "All",
    explain_filter_incorrect: "Incorrect",
    explain_filter_correct: "Correct",
    explain_advice_title: "AI Strategy Advice",
    explain_empty_filter: "No questions match your current filter.",
    explain_q_title: "Question:",
    explain_ans_yours: "Your Answer:",
    explain_ans_skipped: "Skipped",
    explain_ans_correct: "Correct Answer:",
    explain_ai_analysis: "AI Examiner Analysis",
    explain_ai_tips: "Trap Avoidance & Tactics",
    explain_tx_title: "Transaction",
    explain_tx_status: "Status",
    explain_tx_charged: "1 Credit Charged",
    explain_tx_free: "Free (Cached)",
    explain_summary_title: "Result Summary",
    explain_summary_mistakes: "Mistakes Found",
    explain_summary_correct: "Correct Answers",
    explain_upsell_title: "Break Your IELTS Limits",
    explain_upsell_desc: "Unlock deep-dive analysis for all queries and 1-on-1 AI Speaking practice.",
    explain_upsell_btn: "Upgrade Premium",
    explain_footer_back: "Back to Results",
    practice_err_invalid_id: "Error: Test ID is invalid. Please try another test.",
    practice_err_start: "Failed to start the exam. Please try again.",
    practice_full_test: "Full Practice Test"
  }
}
