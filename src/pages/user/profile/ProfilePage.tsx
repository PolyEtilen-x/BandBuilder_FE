import { useState } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useAuthStore } from "@/services/auth/auth.store"
import { useNavigate } from "react-router-dom"
import { LogOut, Settings, Award, BookOpen, Clock, TrendingUp, Calendar, CreditCard } from "lucide-react"
import { useUserProfile } from "@/hooks/useUser"
import EditProfileModal from "./EditProfileModal"
import { useUIStore } from "@/services/ui/ui.store"
import "./style.css"

export default function ProfilePage() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: profile, isLoading, error } = useUserProfile()
  const [openEditModal, setOpenEditModal] = useState(false)

  // UI state hooks
  const { t, language } = useUIStore()

  if (isLoading) return (
    <MainLayout>
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>{t("profile_loading")}</p>
      </div>
    </MainLayout>
  )

  if (error || !profile) return (
    <MainLayout>
      <div className="profile-error">
        <p>{t("profile_error")}</p>
        <button onClick={() => window.location.reload()}>
          {language === "vi" ? "Thử lại" : "Retry"}
        </button>
      </div>
    </MainLayout>
  )

  const { user, stats, recentActivities } = profile

  const statsCards = [
    { label: t("profile_stat_tests"), value: stats.testsCompleted, icon: <BookOpen size={20} />, color: "#3b82f6" },
    { label: t("profile_stat_avg"), value: stats.avgBandScore.toFixed(1), icon: <TrendingUp size={20} />, color: "#10b981" },
    { label: t("profile_stat_streak"), value: language === "vi" ? `${stats.studyStreak} Ngày` : `${stats.studyStreak} Days`, icon: <Calendar size={20} />, color: "#f59e0b" },
    { label: t("profile_stat_hours"), value: `${(stats.totalStudyTime / 60).toFixed(1)}h`, icon: <Clock size={20} />, color: "#8b5cf6" },
  ]

  return (
    <MainLayout>
      <div className="profile-page-wrapper">
        <div className="profile-main-container">

          {/* TOP SECTION: USER INFO */}
          <section className="profile-hero-card">
            <div className="user-profile-info">
              <div className="profile-avatar-wrapper">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName || "User Avatar"} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {(user.fullName || user.email || "G").charAt(0).toUpperCase()}
                  </div>
                )}
                {user.isPro && <div className="pro-badge-icon"><Award size={14} /></div>}
              </div>

              <div className="user-meta-info">
                <div className="user-name-row">
                  <h1>{user.fullName || "Guest"}</h1>
                  <span className={`membership-tag ${user.isPro ? 'pro' : 'basic'}`}>
                    {user.isPro ? t("profile_membership_pro") : t("profile_membership_basic")}
                  </span>
                </div>
                <p className="user-email-text">{user.email}</p>
                <div className="user-credits-info">
                  <CreditCard size={14} />
                  <span>{user.totalCredits - user.usedCredits} {t("profile_credits_rem")}</span>
                </div>
              </div>
            </div>

            <div className="profile-header-actions">
              {!user.isPro && (
                <button className="btn-action-primary upgrade cursor-pointer" onClick={() => navigate("/upgrade")}>
                  <Award size={18} />
                  {t("profile_upgrade_btn")}
                </button>
              )}
              <button className="btn-action-secondary cursor-pointer" onClick={() => setOpenEditModal(true)}>
                <Settings size={18} />
                {t("profile_edit_btn")}
              </button>
              <button className="btn-action-outline logout cursor-pointer" onClick={() => logout()}>
                <LogOut size={18} />
                {t("profile_signout")}
              </button>
            </div>
          </section>

          {/* STATS SECTION */}
          <div className="profile-stats-grid">
            {statsCards.map((stat, i) => (
              <div key={i} className="profile-stat-box">
                <div className="stat-box-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-box-content">
                  <div className="stat-box-value">{stat.value}</div>
                  <div className="stat-box-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM SECTION: ACTIVITIES & PROGRESS */}
          <div className="profile-bottom-grid">
            <div className="recent-activity-card">
              <div className="card-header-row">
                <h2>{t("profile_activity_title")}</h2>
                <button className="text-btn">{t("profile_activity_view")}</button>
              </div>

              <div className="activity-items-list">
                {recentActivities.length === 0 ? (
                  <div className="empty-activity">
                    <p>{t("profile_activity_empty")}</p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="activity-list-item cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      onClick={() => navigate(`/practice-ielts/result/${activity.id}?type=attempt&skill=${activity.skill.toLowerCase()}`)}
                      style={{ cursor: "pointer", transition: "background 0.2s" }}
                    >
                      <div className="item-main-info">
                        <div className={`skill-indicator ${activity.skill.toLowerCase()}`}>
                          {activity.skill.charAt(0)}
                        </div>
                        <div className="item-text-details">
                          <div className="activity-title">{activity.title}</div>
                          <div className="activity-meta">
                            {activity.skill} • {new Date(activity.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="item-score-badge">
                        <div className="score-value">
                          {typeof activity.score === 'object' ? (language === "vi" ? "Hoàn thành" : "Completed") : `Band ${activity.score}`}
                        </div>
                        <div className={`score-status ${activity.status.toLowerCase()}`}>
                          {activity.status}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="profile-sidebar-cards">
              <div className="account-summary-card">
                <h3>{t("profile_summary_title")}</h3>
                <div className="summary-row">
                  <span>{t("profile_summary_joined")}</span>
                  <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="summary-row">
                  <span>{t("profile_summary_sessions")}</span>
                  <strong>
                    {stats.testsCompleted} {language === "vi" ? "phiên" : "sessions"}
                  </strong>
                </div>
                <div className="summary-row">
                  <span>{t("profile_summary_credits")}</span>
                  <strong>{user.usedCredits} / {user.totalCredits}</strong>
                </div>
              </div>

              <div className="pro-upsell-card">
                <div className="upsell-icon"><Award size={32} /></div>
                <h4>{t("profile_upsell_title")}</h4>
                <p>{t("profile_upsell_desc")}</p>
                <button className="cursor-pointer" onClick={() => navigate("/upgrade")}>{t("profile_upsell_btn")}</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <EditProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        initialData={{
          fullName: user.fullName || "",
          avatarUrl: user.avatarUrl || ""
        }}
      />
    </MainLayout>
  )
}
