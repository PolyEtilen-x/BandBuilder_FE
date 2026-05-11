import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useAuthStore } from "@/services/auth/auth.store"
import { LogOut, Settings, Award, BookOpen, Clock, TrendingUp } from "lucide-react"
import "./style.css"

export default function ProfilePage() {
  const { user, logout } = useAuthStore()

  // Dữ liệu mẫu (sau này sẽ fetch từ API)
  const stats = [
    { label: "Tests Completed", value: "24", icon: <BookOpen size={20} />, color: "#3b82f6" },
    { label: "Avg. Band Score", value: "7.0", icon: <TrendingUp size={20} />, color: "#10b981" },
    { label: "Study Streak", value: "5 Days", icon: <Award size={20} />, color: "#f59e0b" },
    { label: "Total Time", value: "12.5h", icon: <Clock size={20} />, color: "#8b5cf6" },
  ]

  const recentTests = [
    { id: 1, title: "Cambridge IELTS 18 - Test 1", skill: "Reading", score: "7.5", date: "2 hours ago" },
    { id: 2, title: "IELTS Online Practice 2024", skill: "Listening", score: "6.5", date: "Yesterday" },
    { id: 3, title: "Academic Writing Task 1", skill: "Writing", score: "7.0", date: "2 days ago" },
  ]

  const isPro = false // Giả sử tài khoản đang là Normal

  return (
    <MainLayout>
      <div className="profile-page">
        <div className="profile-container">

          {/* Header Section */}
          <div className="profile-header">
            <div className="user-info">
              <div className="avatar-circle">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="name-row">
                  <h1>{user?.email?.split("@")[0]}</h1>
                  <span className={`status-badge ${isPro ? 'pro' : 'normal'}`}>
                    {isPro ? 'Pro' : 'Normal'}
                  </span>
                </div>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="header-actions">
              {!isPro && (
                <button className="btn-upgrade">
                  <Award size={18} />
                  Upgrade Pro
                </button>
              )}
              <button className="btn-settings">
                <Settings size={18} />
                Edit Profile
              </button>
              <button className="btn-logout" onClick={() => logout()}>
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: `${stat.color}1a`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Section */}
          <div className="activity-card">
            <h2>Recent Activity</h2>

            <div className="activity-list">
              {recentTests.map((test) => (
                <div key={test.id} className="activity-item">
                  <div className="activity-info">
                    <div className="activity-skill-icon">
                      {test.skill.charAt(0)}
                    </div>
                    <div className="activity-details">
                      <div className="title">{test.title}</div>
                      <div className="meta">{test.skill} • {test.date}</div>
                    </div>
                  </div>
                  <div className="activity-score">
                    <div className="band">Band {test.score}</div>
                    <div className="status">PASSED</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-history">
              View Full History
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}
