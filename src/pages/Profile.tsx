import { useState, useEffect } from 'react'
import { useTheme } from '../theme'
import type { Theme } from '../theme'

const PROFILE_TEMPLATE = {
  avatar: null,
  fullName: '',
  email: '',
  targetJob: '',
  bio: '',
  currentRole: '',
  experienceLevel: 'mid-level',
  theme: 'dark', // default dark theme
  notificationPref: 'all',
  interviewDuration: 'standard',
}

function ProfilePage() {
  const [profile, setProfile] = useState(PROFILE_TEMPLATE)
  const { theme: currentTheme, setTheme } = useTheme()
  const [editing, setEditing] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aptivue-profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Initialize with current theme from context if not in saved data
        setProfile(prev => ({
          ...prev,
          ...parsed,
          theme: parsed.theme || currentTheme
        }))
      } else {
        // If no saved profile, start with template but use current theme
        setProfile(prev => ({ ...prev, theme: currentTheme }))
      }
    } catch (e) {
      console.warn('Failed to load profile from localStorage:', e)
      // Fallback to template with current theme
      setProfile(PROFILE_TEMPLATE)
    }
  }, [currentTheme])

  // Save to localStorage whenever profile changes
  useEffect(() => {
    try {
      localStorage.setItem('aptivue-profile', JSON.stringify(profile))
    } catch (e) {
      console.warn('Failed to save profile to localStorage:', e)
    }
  }, [profile])

  const handleSave = () => {
    setEditing(false)
  }

  const handleReset = () => {
    setProfile(PROFILE_TEMPLATE)
    setEditing(false)
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Profile Settings</h1>
        <button onClick={() => setEditing(!editing)}>
          {editing ? 'Edit Profile' : 'View Profile'}
        </button>
      </header>

      <main className="profile-content">
        {/* Avatar Section */}
        <section className="profile-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!editing}
            />
          </div>
        </section>

        {/* Target Job Section */}
        <section className="profile-section">
          <h2>Career Preferences</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetJob">Target Job Title</label>
              <input
                id="targetJob"
                type="text"
                value={profile.targetJob}
                onChange={(e) => setProfile({ ...profile, targetJob: e.target.value })}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Preferred Location</label>
              <input
                id="location"
                type="text"
                value={profile.currentRole}
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                disabled={!editing}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="experienceLevel">Experience Level</label>
            <select
              id="experienceLevel"
              value={profile.experienceLevel || 'mid-level'}
              onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
              disabled={!editing}
            >
              <option value="junior">Junior</option>
              <option value="mid-level">Mid-level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead / Manager</option>
            </select>
          </div>
        </section>

        {/* Application Preferences */}
        <section className="profile-section">
          <h2>Application Preferences</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="notificationPref">Notification Preference</label>
              <select
                id="notificationPref"
                value={profile.notificationPref}
                onChange={(e) => setProfile({ ...profile, notificationPref: e.target.value })}
                disabled={!editing}
              >
                <option value="all">All Notifications</option>
                <option value="essential">Essential Only</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="interviewDuration">Interview Duration</label>
              <select
                id="interviewDuration"
                value={profile.interviewDuration}
                onChange={(e) => setProfile({ ...profile, interviewDuration: e.target.value })}
                disabled={!editing}
              >
                <option value="short">Short (30 min)</option>
                <option value="standard">Standard (45 min)</option>
                <option value="long">Long (60+ min)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="profile-section">
          <h2>Theme Preference</h2>
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={profile.theme}
              onChange={(e) => {
                const newTheme = e.target.value as Theme
                setProfile({ ...profile, theme: newTheme })
                setTheme(newTheme) // Actually change the theme via context
              }}
              disabled={!editing}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </section>

        {/* Bio Section */}
        <section className="profile-section">
          <h2>Professional Bio</h2>
          <textarea
            id="bio"
            rows={4}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            disabled={!editing}
          />
        </section>
      </main>

      {editing && (
        <div className="edit-panel">
          <h3>Edit Profile</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Target Job</label>
              <input
                value={profile.targetJob}
                onChange={(e) => setProfile({ ...profile, targetJob: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Current Role</label>
              <input
                value={profile.currentRole}
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Experience Level</label>
              <select
                value={profile.experienceLevel || 'mid-level'}
                onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
              >
                <option value="junior">Junior</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead / Manager</option>
              </select>
            </div>
            <div className="form-field">
              <label>Notifications</label>
              <select
                value={profile.notificationPref}
                onChange={(e) => setProfile({ ...profile, notificationPref: e.target.value })}
              >
                <option value="all">All Notifications</option>
                <option value="essential">Essential Only</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div className="form-field">
              <label>Interview Duration</label>
              <select
                value={profile.interviewDuration}
                onChange={(e) => setProfile({ ...profile, interviewDuration: e.target.value })}
              >
                <option value="short">Short (30 min)</option>
                <option value="standard">Standard (45 min)</option>
                <option value="long">Long (60+ min)</option>
              </select>
            </div>
            <div className="form-field">
              <label>Theme</label>
              <select
                value={profile.theme}
                onChange={(e) => {
                  const newTheme = e.target.value as Theme
                  setProfile({ ...profile, theme: newTheme })
                  setTheme(newTheme)
                }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div className="form-field">
              <label>Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
          </div>
          <div className="panel-actions">
            <button onClick={handleSave}>
              Save Changes
            </button>
            <button onClick={handleReset}>
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage