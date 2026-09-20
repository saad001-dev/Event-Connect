import React, { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

function ProfilePage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    title: user?.title || "",
    company: user?.company || "",
    bio: user?.bio || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  if (!user) {
    return (
      <div className="text-center py-12 glass-card p-12">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white">Please Login</h2>
        <p className="text-white/40 mt-2">
          You need to be logged in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-white/40 text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field bg-white/5 cursor-not-allowed"
              disabled
            />
            <p className="text-white/20 text-xs mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="input-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div>
            <label className="input-label">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Veyrivo Technologies"
            />
          </div>

          <div>
            <label className="input-label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Tell others about yourself..."
            />
            <p className="text-white/20 text-xs mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          <button type="submit" className="w-full btn-primary py-3">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
