import React, { useState } from 'react';

const DarkMode = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    document.documentElement.classList.toggle('dark', !isChecked);
  };

  return (
    <div className="absolute top-4 right-4">
      <label className="relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only peer"
        />
        <span className="mr-[18px] text-sm font-medium text-[#F1F0FA]">
          Switch Version
        </span>
        <div
          className="flex h-[46px] w-[82px] items-center justify-center rounded-full
          bg-[#15151f] border border-white/10
          peer-focus-visible:ring-2 peer-focus-visible:ring-[#6C5CE7]/60"
        >
          <span
            aria-hidden="true"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200
              ${!isChecked ? 'bg-[#6C5CE7] text-white' : 'text-slate-500'}`}
          >
            ☀️
          </span>
          <span
            aria-hidden="true"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200
              ${isChecked ? 'bg-[#6C5CE7] text-white' : 'text-slate-500'}`}
          >
            🌙
          </span>
        </div>
      </label>
    </div>
  );
};

export default DarkMode;
