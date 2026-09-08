import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/ai/published-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  const toggleLike = async (creation) => {
    if (!user) return;

    try {
      const { data } = await axios.post(
        '/api/ai/toggle-like',
        { creationId: creation.id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setCreations((prev) =>
          prev.map((c) => (c.id === creation.id ? { ...c, likes: data.likes } : c))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="relative flex-1 h-full flex flex-col gap-4 p-6 bg-[#0a0a12] overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full opacity-[0.15] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <h1 className="relative font-display text-xl font-medium text-white">
        Community <span className="italic text-[#9F91F0]">Creations</span>
      </h1>

      <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur-sm h-full w-full
      rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {loading ? (
          <p className="text-slate-500 text-center col-span-full">Loading community creations...</p>
        ) : creations.length > 0 ? (
          creations.map((creation) => (
            <div
              key={creation.id}
              className="relative group bg-[#0f0f1a] border border-white/10 rounded-xl overflow-hidden
              hover:border-[#6C5CE7]/50 transition-colors duration-200"
            >
              <img
                src={creation.content}
                alt={creation.prompt}
                className="w-full h-64 object-cover"
              />

              <p className="absolute inset-x-0 bottom-0 bg-[#0a0a12]/85 text-slate-200 text-sm p-2
              opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {creation.prompt}
              </p>

              <div className="flex justify-between items-center px-4 py-3 bg-[#0f0f1a] border-t border-white/10">
                <p className="text-sm text-slate-400">{(creation.likes || []).length} Likes</p>
                <Heart
                  onClick={() => toggleLike(creation)}
                  className={`w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${
                    (creation.likes || []).includes(user?.id)
                      ? "fill-red-400 text-red-400"
                      : "text-slate-500"
                  }`}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-center col-span-full">
            No creations yet. Start sharing your work!
          </p>
        )}
      </div>
    </div>
  );
};

export default Community;