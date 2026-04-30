import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, Lock } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Shorten Your Links, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Expand Your Reach.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Create custom, trackable, and secure short links in seconds. Get detailed analytics and take control of your marketing campaigns.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard" className="btn-primary text-lg flex items-center gap-2">
            Start for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto px-4">
        <FeatureCard 
          icon={<Zap className="w-8 h-8 text-yellow-400" />}
          title="Custom Slugs"
          description="Create branded, memorable links instead of random characters."
          delay={0.2}
        />
        <FeatureCard 
          icon={<BarChart3 className="w-8 h-8 text-primary" />}
          title="Advanced Analytics"
          description="Track clicks, locations, devices, and browsers in real-time."
          delay={0.4}
        />
        <FeatureCard 
          icon={<Lock className="w-8 h-8 text-secondary" />}
          title="Link Expiry & Limits"
          description="Set time limits, click limits, or password protect your exclusive links."
          delay={0.6}
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="glass-panel p-6 hover:border-primary/50 transition-colors"
  >
    <div className="bg-darker/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default Landing;
