import { useState, useEffect } from "react"
import { X, User, Camera, Loader2 } from "lucide-react"
import { useUpdateProfile } from "@/hooks/useUser"

type Props = {
  open: boolean
  onClose: () => void
  initialData: {
    fullName: string
    avatarUrl: string
  }
}

export default function EditProfileModal({ open, onClose, initialData }: Props) {
  const [fullName, setFullName] = useState(initialData.fullName)
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl)
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  useEffect(() => {
    if (open) {
      setFullName(initialData.fullName)
      setAvatarUrl(initialData.avatarUrl)
    }
  }, [open, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ fullName, avatarUrl }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="modal-title">Edit Profile</h2>
        <p className="modal-subtitle">Update your personal information and avatar</p>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label><User size={16} /> Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label><Camera size={16} /> Avatar URL</label>
            <input 
              type="text" 
              value={avatarUrl} 
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
