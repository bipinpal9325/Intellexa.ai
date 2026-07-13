import React, { useEffect, useState } from 'react';
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkles } from 'lucide-react';
import CreationItems from '../components/CreationItems';

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [plan, setPlan] = useState('Free'); // placeholder - replace with real plan logic

  const getDashboardData = async () => {
    // replace with real fetch if needed
    setCreations(dummyCreationData);
    // placeholder plan value — replace by reading user metadata or API
    setPlan('Premium');
  };

  useEffect(() => {
    getDashboardData();
  }, []);

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
            <h2 className="font-display text-xl text-white">{creations.length}</h2>
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
            <h2 className="font-display text-xl text-white">{plan}</h2>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/15 border border-[#6C5CE7]/30
          text-[#9F91F0] flex justify-center items-center">
            <Gem className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className='relative space-y-3'>
        <p className='mt-8 mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-[#9F91F0]'>
          Recent Creations
        </p>
        {
          creations.map((item) => <CreationItems key={item.id} item={item} />)
        }
      </div>
    </div>
  );
};

export default Dashboard;
