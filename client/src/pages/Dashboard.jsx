import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import {
  Gem, Sparkles, SquarePen, Hash, Image as ImageIcon,
  Eraser, Scissors, FileText, ChevronRight, X
} from 'lucide-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const TOOL_MAP = {
  'article': { label: 'Write Article', Icon: SquarePen, view: 'markdown' },
  'blog-title': { label: 'Blog Titles', Icon: Hash, view: 'markdown' },
  'image': { label: 'Generate Images', Icon: ImageIcon, view: 'image' },
  'background-removal': { label: 'Remove Background', Icon: Eraser, view: 'image' },
  'object-removal': { label: 'Remove Object', Icon: Scissors, view: 'image' },
  'resume-review': { label: 'Review Resume', Icon: FileText, view: 'markdown' },
};

const FALLBACK_TOOL = { label: 'Creation', Icon: Sparkles, view: 'markdown' };

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [activePlan, setActivePlan] = useState('Free');
  const [planLoading, setPlanLoading] = useState(true);

  const { getToken, has, isLoaded } = useAuth();

  // Reads the user's real subscription state directly from Clerk's
  // billing check, rather than a hardcoded value or an implicit
  // fallback-render pattern. `has` is only usable once Clerk itself has
  // finished loading — checking isLoaded avoids a false "Free" flash
  // before Clerk's auth state is actually ready.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const isPremium = has?.({ plan: 'Premium' });
      setActivePlan(isPremium ? 'Premium' : 'Free');
    } catch (error) {
      console.error('Failed to check plan status:', error);
      setActivePlan('Free');
    } finally {
      setPlanLoading(false);
    }
  }, [isLoaded, has]);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/ai/user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
        setTotalCount(data.totalCount);
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
    getDashboardData();
  }, []);

  const selectedTool = selectedCreation
    ? (TOOL_MAP[selectedCreation.type] || FALLBACK_TOOL)
    : null;

  return (
    <div className="relative h-full overflow-y-scroll p-6 bg-[#0a0a12]">
      <div
        className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative flex justify-start gap-4 flex-wrap">

        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white/[0.03] rounded-2xl
        border border-white/10 backdrop-blur-sm">
          <div className="text-slate-400">
            <p className="text-sm">Total Creations</p>
            <h2 className="font-display text-xl text-white">{totalCount}</h2>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/15 border border-[#6C5CE7]/30
          text-[#9F91F0] flex justify-center items-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white/[0.03] rounded-2xl
        border border-white/10 backdrop-blur-sm">
          <div className="text-slate-400">
            <p className="text-sm">Active Plan</p>
            <h2 className="font-display text-xl text-white">
              {planLoading ? '...' : activePlan}
            </h2>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/15 border border-[#6C5CE7]/30
          text-[#9F91F0] flex justify-center items-center">
            <Gem className="w-5 h-5" />
          </div>
        </div>

      </div>

      {selectedCreation && (
        <div className='relative mt-8 p-4 bg-white/[0.03] rounded-2xl border border-[#6C5CE7]/30 backdrop-blur-sm'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-lg bg-[#6C5CE7]/15 border border-[#6C5CE7]/30
              text-[#9F91F0] flex items-center justify-center'>
                <selectedTool.Icon className='w-4 h-4' />
              </div>
              <div>
                <p className='text-sm font-medium text-white'>{selectedTool.label}</p>
                <p className='text-xs text-slate-500'>{selectedCreation.prompt}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCreation(null)}
              className='text-slate-500 hover:text-white transition-colors p-1 rounded-lg
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
              aria-label="Close"
            >
              <X className='w-4 h-4' />
            </button>
          </div>

          <div className='max-h-[500px] overflow-y-auto'>
            {selectedTool.view === 'image' ? (
              <img
                src={selectedCreation.content}
                alt={selectedCreation.prompt}
                className='w-full max-h-[460px] object-contain rounded-lg border border-white/10'
              />
            ) : (
              <div className='reset-tw text-sm text-slate-300'>
                <Markdown>{selectedCreation.content}</Markdown>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='relative space-y-3'>
        <p className='mt-8 mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-[#9F91F0]'>
          Recent Creations
        </p>

        {loading ? (
          <p className='text-sm text-slate-500'>Loading your creations...</p>
        ) : creations.length === 0 ? (
          <p className='text-sm text-slate-500'>
            No creations yet. Try one of the tools in the sidebar to get started.
          </p>
        ) : (
          creations.map((item) => {
            const tool = TOOL_MAP[item.type] || FALLBACK_TOOL;
            const { label, Icon } = tool;
            const isActive = selectedCreation?.id === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedCreation(item)}
                className={`w-full flex items-center justify-between gap-4 p-4 rounded-2xl
                border backdrop-blur-sm transition-colors text-left cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60
                ${isActive
                  ? 'bg-[#6C5CE7]/10 border-[#6C5CE7]/50'
                  : 'bg-white/[0.03] border-white/10 hover:border-[#6C5CE7]/50'}`}
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-9 h-9 shrink-0 rounded-lg bg-[#6C5CE7]/15 border border-[#6C5CE7]/30
                  text-[#9F91F0] flex items-center justify-center'>
                    <Icon className='w-4 h-4' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-white'>{label}</p>
                    <p className='text-xs text-slate-500 truncate max-w-xs'>{item.prompt}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3 shrink-0'>
                  <p className='text-xs text-slate-500'>
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <ChevronRight className='w-4 h-4 text-slate-500' />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;