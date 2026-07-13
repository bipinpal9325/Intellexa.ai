import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItems = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  if (!item) {
    return <div className="p-4 text-red-400">No item data provided</div>;
  }

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white/[0.03] border border-white/10
                 rounded-2xl backdrop-blur-sm cursor-pointer
                 hover:border-[#6C5CE7]/50 transition-colors duration-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-medium text-[#F1F0FA]">{item.prompt}</h2>
          <p className="text-slate-500">
            {item.type} – {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <button
          type="button"
          className="bg-[#6C5CE7]/15 border border-[#6C5CE7]/30 text-[#9F91F0]
                     px-4 py-1 rounded-full text-xs font-medium"
        >
          {item.type}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-3">
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="Generated content"
              className="mt-2 w-full max-w-md rounded-lg border border-white/10"
            />
          ) : (
            <div className="mt-2 text-sm text-slate-300">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItems;
