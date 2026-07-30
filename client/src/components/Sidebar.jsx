import React, { useEffect } from 'react';
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

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

// Shows the Clerk avatar when available, otherwise falls back to initials
// instead of a broken <img> icon.
const Avatar = ({ user, size = 'w-14 h-14' }) => {
  if (user?.imageUrl) {
    return (
      <img
        src={user.imageUrl}
        alt={user?.fullName ? `${user.fullName}'s avatar` : 'User avatar'}
        className={`${size} rounded-full object-cover border-2 border-[#0f0f1a]`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center bg-[#6C5CE7]/20
      text-[#F1F0FA] text-sm font-semibold border-2 border-[#0f0f1a] shrink-0`}
      aria-hidden="true"
    >
      {getInitials(user?.fullName)}
    </div>
  );
};

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  // Lock background scroll while the mobile sidebar is open
  useEffect(() => {
    if (sidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebar]);

  return (
    <>
      {/* Mobile-only backdrop: tap outside the sidebar to close it */}
      {sidebar && (
        <div
          onClick={() => setSidebar(false)}
          className="fixed inset-0 top-14 bg-black/50 z-[9] sm:hidden"
          aria-hidden="true"
        />
      )}

      <div
        className={`relative w-60 bg-[#0f0f1a] border-r border-white/10 flex flex-col justify-between
        items-center max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:left-0 z-10 overflow-hidden
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
        transition-transform duration-300 ease-in-out`}
      >
        <div
          className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative mt-7 mb-2 w-full flex-1 flex flex-col min-h-0">
          <Avatar user={user} />
          <h1 className="mt-1 text-center text-[#F1F0FA] font-medium truncate px-4">
            {user?.fullName || 'User'}
          </h1>

          {/* Independently scrollable so short viewports never clip nav items */}
          <nav
            aria-label="Main navigation"
            className="px-6 mt-5 text-sm text-slate-400 font-medium overflow-y-auto flex-1 space-y-1"
          >
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
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="relative w-full border-t border-white/10 p-4 px-7 flex items-center justify-between gap-2">
          <button
            onClick={openUserProfile}
            className="flex gap-2 items-center cursor-pointer text-left min-w-0
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60 rounded-lg"
          >
            <Avatar user={user} size="w-8 h-8" />
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-[#F1F0FA] truncate">{user?.fullName}</h1>
              <p className="text-xs text-slate-400">
                <Protect plan="Premium" fallback="Free">Premium</Protect> Plan
              </p>
            </div>
          </button>
          <button
            onClick={signOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#F1F0FA] hover:bg-white/[0.05]
            transition-colors duration-200 cursor-pointer shrink-0
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60"
            aria-label="Sign out"
          >
            <LogOut className="w-4.5 h-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;