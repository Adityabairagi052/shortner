import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link2, Plus, Copy, ExternalLink, BarChart2 } from 'lucide-react';

const mockChartData = [
  { name: 'Mon', clicks: 12 },
  { name: 'Tue', clicks: 19 },
  { name: 'Wed', clicks: 15 },
  { name: 'Thu', clicks: 22 },
  { name: 'Fri', clicks: 30 },
  { name: 'Sat', clicks: 45 },
  { name: 'Sun', clicks: 28 },
];

const mockLinks = [
  { id: 1, title: 'Portfolio', shortUrl: 'snapshort.in/adi123', originalUrl: 'https://aditya-portfolio.com', clicks: 145 },
  { id: 2, title: 'Twitter Promo', shortUrl: 'snapshort.in/twPromo', originalUrl: 'https://twitter.com/offer', clicks: 89 },
];

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Link
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Links" value="12" icon={<Link2 className="w-6 h-6 text-primary" />} />
        <StatCard title="Total Clicks" value="1,245" icon={<BarChart2 className="w-6 h-6 text-secondary" />} />
        <StatCard title="Avg Clicks/Link" value="103" icon={<BarChart2 className="w-6 h-6 text-yellow-400" />} />
      </div>

      {/* Charts & Links Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-xl font-bold mb-6">Clicks Over Time</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#ec4899' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Links */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-6">Recent Links</h2>
          <div className="space-y-4">
            {mockLinks.map(link => (
              <div key={link.id} className="bg-darker/50 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate pr-2">{link.title}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                    {link.clicks} clicks
                  </span>
                </div>
                <p className="text-gray-400 text-sm truncate mb-3">{link.originalUrl}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary font-medium">{link.shortUrl}</span>
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-darker rounded-lg hover:text-primary transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-darker rounded-lg hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Create Link Modal (Simple Overlay for Demo) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-darker/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Link</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Destination URL</label>
                <input type="url" placeholder="https://example.com/long-url" className="w-full bg-darker border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Custom Alias (Optional)</label>
                  <input type="text" placeholder="my-campaign" className="w-full bg-darker border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date (Optional)</label>
                  <input type="date" className="w-full bg-darker border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-primary py-2">Create Short Link</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="glass-panel p-6 flex items-center gap-4">
    <div className="bg-darker/50 p-4 rounded-2xl border border-white/5">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  </div>
);

export default Dashboard;
