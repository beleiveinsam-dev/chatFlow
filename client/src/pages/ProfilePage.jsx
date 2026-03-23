import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({
        profilePic: base64Image,
        fullName: name,
        bio,
      });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between max-lg:flex-col">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 p-10 flex-1 max-w-md"
          >
            <div className="mb-2">
              <h3 className="text-2xl font-light text-white mb-2">
                Profile Settings
              </h3>
              <p className="text-gray-400 text-sm">
                Update your profile information
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                Profile Picture
              </label>
              <label
                htmlFor="avatar"
                className="flex items-center gap-4 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-800/70 transition-colors group"
              >
                <input
                  onChange={(e) => {
                    setSelectedImg(e.target.files[0]);
                  }}
                  type="file"
                  id="avatar"
                  accept=".png, .jpg, .jpeg"
                  hidden
                />
                <div className="relative">
                  <img
                    src={
                      selectedImg
                        ? URL.createObjectURL(
                          selectedImg
                        )
                        : assets.avatar_icon
                    }
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-600/50"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition-colors"></div>
                </div>
                <div>
                  <p className="text-white text-sm">
                    Upload Profile Image
                  </p>
                  <p className="text-gray-400 text-xs">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                Full Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                placeholder="Enter your full name"
                type="text"
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder="Tell us about yourself..."
                required
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all resize-none"
                rows={4}
              ></textarea>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white py-3 px-6 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="flex-1 flex items-center justify-center p-10 max-lg:pt-0">
            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <img
                  className="w-48 h-48 rounded-full object-cover ring-4 ring-gray-600/30 shadow-2xl"
                  src={
                    authUser.profilePic || assets.logo_icon
                  }
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full"></div>
              </div>
              <h2 className="text-2xl font-light text-white mb-2">
                {authUser.fullName}
              </h2>
              <p className="text-gray-400 text-sm">
                @{authUser.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
