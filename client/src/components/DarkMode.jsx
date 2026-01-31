import React, { useState } from 'react';

const DarkMode = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    // Optional: Toggle dark mode class on <html>
    document.documentElement.classList.toggle('dark', !isChecked);
  };

  return (
    <div className="absolute top-4 right-4">
      <label className="themeSwitcherThree relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <span className="mr-[18px] text-sm font-medium text-black dark:text-white">
          Switch Version
        </span>
        <div className="shadow-card flex h-[46px] w-[82px] items-center justify-center rounded-md bg-white dark:bg-gray-800">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded ${
              !isChecked ? 'bg-primary text-white' : 'text-body-color'
            }`}
          >
            {/* Sun Icon */}
            ☀️
          </span>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded ${
              isChecked ? 'bg-primary text-white' : 'text-body-color'
            }`}
          >
            {/* Moon Icon */}
            🌙
          </span>
        </div>
      </label>
    </div>
  );
};

export default DarkMode;
