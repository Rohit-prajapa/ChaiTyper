import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Edit2, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleEdit = () => {
    setFullName(user.fullName);
    setUsername(user.username);
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setUsername(user.username);
    setError("");
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (fullName.trim().length < 3 || fullName.trim().length > 50) {
      setError("Full name must contain 3-50 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      setError(
        "Username must be 3-20 characters and contain only letters, numbers or underscores.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await updateProfile({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-4 py-8 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400 mt-2">
            Manage your ChaiTyper account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#151515] border border-[#292929] rounded-2xl p-6 md:p-8">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-8">
            <div className="w-24 h-24 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-3xl font-bold text-orange-500">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-400">@{user.username}</p>
              <span className="inline-block mt-2 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                Active Account
              </span>
            </div>
          </div>

          <div className="border-t border-[#292929] pt-6">
            {/* Section Heading */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>

              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition text-sm"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={50}
                    required
                    className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    required
                    className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Email - Read Only */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-semibold px-5 py-3 rounded-lg transition"
                  >
                    <Save size={17} />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#292929] hover:bg-[#383838] px-5 py-3 rounded-lg transition"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                {/* Full Name */}
                <div className="flex items-center gap-4">
                  <User className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                </div>

                {/* Username */}
                <div className="flex items-center gap-4">
                  <User className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">@{user.username}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <Mail className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
