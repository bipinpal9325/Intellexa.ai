import React from 'react';
import { NavLink } from 'react-router-dom';
import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`relative w-60 bg-[#0f0f1a] border-r border-white/10 flex flex-col justify-between
      items-center max-sm:absolute max-sm:top-14 max-sm:bottom-0 z-10 overflow-hidden
      ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
      transition-transform duration-300 ease-in-out`}
    >
      <div
        className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-[0.12] blur-[100px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative my-7 w-full">
        <img
          src={user?.imageUrl || undefined}
          alt="User avatar"
          className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-[#0f0f1a]"
        />
        <h1 className="mt-1 text-center text-[#F1F0FA] font-medium">{user?.fullName || 'User'}</h1>

        <div className="px-6 mt-5 text-sm text-slate-400 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded-lg transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60
                ${isActive
                  ? 'bg-[#6C5CE7] text-white'
                  : 'hover:bg-white/[0.05] hover:text-[#F1F0FA]'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} aria-hidden="true" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="relative w-full border-t border-white/10 p-4 px-7 flex items-center justify-between">
        <button
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60 rounded-lg"
        >
          <img
            src={user?.imageUrl || undefined}
            alt=""
            className="w-8 h-8 rounded-full object-cover border-2 border-[#0f0f1a]"
          />
          <div>
            <h1 className="text-sm font-medium text-[#F1F0FA]">{user?.fullName}</h1>
            <p className="text-xs text-slate-400">
              <Protect plan="Premium" fallback="Free">Premium</Protect> Plan
            </p>
          </div>
        </button>
        <LogOut
          onClick={signOut}
          className="w-4.5 h-4.5 text-slate-400 hover:text-[#F1F0FA] transition-colors duration-200 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60 rounded"
          role="button"
          tabIndex={0}
          aria-label="Sign out"
        />
      </div>
    </div>
  );
};

export default Sidebar;