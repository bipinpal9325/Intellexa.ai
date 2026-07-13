import React, { useEffect, useState } from "react";
import { dummyPublishedCreationData } from "../assets/assets";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData);
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  const toggleLike = (index) => {
    if (!user) return;

    setCreations((prev) =>
      prev.map((creation, i) =>
        i === index
          ? {
              ...creation,
              likes: creation.likes.includes(user.id)
                ? creation.likes.filter((id) => id !== user.id)
                : [...creation.likes, user.id],
            }
          : creation
      )
    );
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
        {creations.length > 0 ? (
          creations.map((creation, index) => (
            <div
              key={index}
              className="relative group bg-[#0f0f1a] border border-white/10 rounded-xl overflow-hidden
              hover:border-[#6C5CE7]/50 transition-colors duration-200"
            >
              {/* Image */}
              <img
                src={creation.content}
                alt={creation.prompt}
                className="w-full h-64 object-cover"
              />

              {/* Prompt on hover */}
              <p className="absolute inset-x-0 bottom-0 bg-[#0a0a12]/85 text-slate-200 text-sm p-2
              opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {creation.prompt}
              </p>

              {/* Like Section */}
              <div className="flex justify-between items-center px-4 py-3 bg-[#0f0f1a] border-t border-white/10">
                <p className="text-sm text-slate-400">{creation.likes.length} Likes</p>
                <Heart
                  onClick={() => toggleLike(index)}
                  className={`w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${
                    creation.likes.includes(user?.id)
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
