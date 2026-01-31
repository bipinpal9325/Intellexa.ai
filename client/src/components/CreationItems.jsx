import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItems = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  if (!item) {
    return <div className="p-4 text-red-500">No item data provided</div>;
  }

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200
                 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-semibold text-gray-800">{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} – {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <button
          type="button"
          className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]
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
              className="mt-2 w-full max-w-md rounded-md shadow"
            />
          ) : (
            <div className="mt-2 text-sm text-slate-700">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItems;
