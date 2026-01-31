import React, { useEffect, useState } from "react";
import { dummyPublishedCreationData } from "../assets/assets";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/clerk-react"; // Make sure Clerk is installed

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser(); // Gets the logged-in user

  // Simulated fetch
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
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-gray-800">Community Creations</h1>

      <div className="bg-white h-full w-full rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {creations.length > 0 ? (
          creations.map((creation, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all"
            >
              {/* Image */}
              <img
                src={creation.content}
                alt={creation.prompt}
                className="w-full h-64 object-cover rounded-t-lg"
              />

              {/* Prompt on hover */}
              <p className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {creation.prompt}
              </p>

              {/* Like Section */}
              <div className="flex justify-between items-center px-4 py-3 bg-white rounded-b-lg">
                <p className="text-sm text-gray-600">{creation.likes.length} Likes</p>
                <Heart
                  onClick={() => toggleLike(index)}
                  className={`w-5 h-5 cursor-pointer transition-transform hover:scale-110 ${
                    creation.likes.includes(user?.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No creations yet. Start sharing your work!
          </p>
        )}
      </div>
    </div>
  );
};

export default Community;
