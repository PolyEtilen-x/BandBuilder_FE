import { useState } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useAuthStore } from "@/services/auth/auth.store"
import { useNavigate } from "react-router-dom"
import { LogOut, Settings, Award, BookOpen, Clock, TrendingUp, Calendar, CreditCard } from "lucide-react"
import { useUserProfile } from "@/hooks/useUser"
import EditProfileModal from "./EditProfileModal"
import "./style.css"

export default function ProfilePage() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: profile, isLoading, error } = useUserProfile()
  const [openEditModal, setOpenEditModal] = useState(false)

  if (isLoading) return (
    <MainLayout>
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    </MainLayout>
  )

  if (error || !profile) return (
    <MainLayout>
      <div className="profile-error">
        <p>Could not load profile. Please try again later.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </MainLayout>
  )

  const { user, stats, recentActivities } = profile

  const statsCards = [
    { label: "Tests Completed", value: stats.testsCompleted, icon: <BookOpen size={20} />, color: "#3b82f6" },
    { label: "Avg. Band Score", value: stats.avgBandScore.toFixed(1), icon: <TrendingUp size={20} />, color: "#10b981" },
    { label: "Study Streak", value: `${stats.studyStreak} Days`, icon: <Calendar size={20} />, color: "#f59e0b" },
    { label: "Total Hours", value: `${(stats.totalStudyTime / 60).toFixed(1)}h`, icon: <Clock size={20} />, color: "#8b5cf6" },
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
                  <img src={user.avatarUrl} alt={user.fullName} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.isPro && <div className="pro-badge-icon"><Award size={14} /></div>}
              </div>

              <div className="user-meta-info">
                <div className="user-name-row">
                  <h1>{user.fullName}</h1>
                  <span className={`membership-tag ${user.isPro ? 'pro' : 'basic'}`}>
                    {user.isPro ? 'Premium' : 'Basic Plan'}
                  </span>
                </div>
                <p className="user-email-text">{user.email}</p>
                <div className="user-credits-info">
                  <CreditCard size={14} />
                  <span>{user.totalCredits - user.usedCredits} credits remaining</span>
                </div>
              </div>
            </div>

            <div className="profile-header-actions">
              {!user.isPro && (
                <button className="btn-action-primary upgrade" onClick={() => navigate("/upgrade")}>
                  <Award size={18} />
                  Upgrade Pro
                </button>
              )}
              <button className="btn-action-secondary" onClick={() => setOpenEditModal(true)}>
                <Settings size={18} />
                Edit Profile
              </button>
              <button className="btn-action-outline logout" onClick={() => logout()}>
                <LogOut size={18} />
                Sign Out
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
                <h2>Recent Activity</h2>
                <button className="text-btn">View History</button>
              </div>

              <div className="activity-items-list">
                {recentActivities.length === 0 ? (
                  <div className="empty-activity">
                    <p>No recent activity found. Start practicing to see your progress!</p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-list-item">
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
                          {typeof activity.score === 'object' ? 'Completed' : `Band ${activity.score}`}
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
                <h3>Account Summary</h3>
                <div className="summary-row">
                  <span>Joined on</span>
                  <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="summary-row">
                  <span>Total Practice</span>
                  <strong>{stats.testsCompleted} sessions</strong>
                </div>
                <div className="summary-row">
                  <span>Credits Used</span>
                  <strong>{user.usedCredits} / {user.totalCredits}</strong>
                </div>
              </div>

              <div className="pro-upsell-card">
                <div className="upsell-icon"><Award size={32} /></div>
                <h4>Go Premium</h4>
                <p>Unlock detailed analytics, unlimited practice tests, and expert feedback.</p>
                <button onClick={() => navigate("/upgrade")}>Learn More</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <EditProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        initialData={{
          fullName: user.fullName,
          avatarUrl: user.avatarUrl
        }}
      />
    </MainLayout>
  )
}
