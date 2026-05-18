import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  CreditCard, 
  Slack, 
  BarChart, 
  Zap, 
  ArrowRight, 
  ExternalLink, 
  Check, 
  Plus, 
  Search,
  LayoutGrid,
  Filter,
  ShieldCheck,
  Code2,
  Cpu,
  Video,
  Music2,
  Gamepad2,
  Heart,
  ShoppingBag,
  MessageSquare,
  Globe
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["All", "Social", "Payments", "Productivity", "Analytics", "Automation"];

  const integrations = [
    {
      name: "Instagram",
      description: "Connect and showcase your Instagram portfolio directly on Driplens.",
      icon: <Instagram className="w-8 h-8" />,
      features: ["Portfolio sync", "Analytics", "Content showcase"],
      category: "Social",
      color: "from-purple-500 via-pink-500 to-orange-500",
      status: "Available"
    },
    {
      name: "TikTok",
      description: "Display your TikTok content and reach brands looking for TikTok creators.",
      icon: <Music2 className="w-8 h-8" />,
      features: ["Video showcase", "Engagement metrics", "Creator matching"],
      category: "Social",
      color: "from-black via-gray-900 to-red-600",
      status: "Available"
    },
    {
      name: "YouTube",
      description: "Link your YouTube channel to your creator profile and attract brand partnerships.",
      icon: <Youtube className="w-8 h-8" />,
      features: ["Channel metrics", "Video showcase", "Subscriber data"],
      category: "Social",
      color: "from-red-600 to-red-700",
      status: "Available"
    },
    {
      name: "Twitter/X",
      description: "Connect your Twitter account to display your reach and influence.",
      icon: <Twitter className="w-8 h-8" />,
      features: ["Follower count", "Engagement stats", "Verification"],
      category: "Social",
      color: "from-blue-400 to-blue-600",
      status: "Available"
    },
    {
      name: "LinkedIn",
      description: "Add professional credentials and industry expertise to your profile.",
      icon: <Linkedin className="w-8 h-8" />,
      features: ["Professional profile", "Endorsements", "Experience"],
      category: "Social",
      color: "from-blue-700 to-blue-800",
      status: "Available"
    },
    {
      name: "Stripe",
      description: "Secure payment processing for brand collaborations and sponsorships.",
      icon: <CreditCard className="w-8 h-8" />,
      features: ["Payment processing", "Invoicing", "Payouts"],
      category: "Payments",
      color: "from-indigo-500 to-indigo-600",
      status: "Available"
    },
    {
      name: "Slack",
      description: "Get Driplens notifications directly in your Slack workspace.",
      icon: <Slack className="w-8 h-8" />,
      features: ["Notifications", "Updates", "Collaboration"],
      category: "Productivity",
      color: "from-emerald-500 to-emerald-600",
      status: "Available"
    },
    {
      name: "Google Analytics",
      description: "Track your website traffic and performance metrics from Driplens.",
      icon: <BarChart className="w-8 h-8" />,
      features: ["Traffic analysis", "User behavior", "Conversion tracking"],
      category: "Analytics",
      color: "from-yellow-400 to-orange-500",
      status: "Available"
    },
    {
      name: "Zapier",
      description: "Automate workflows and connect Driplens with 1000+ apps.",
      icon: <Zap className="w-8 h-8" />,
      features: ["Automation", "Workflow building", "App connections"],
      category: "Automation",
      color: "from-orange-500 to-orange-600",
      status: "Available"
    }
  ];

  const comingSoon = [
    { name: "Twitch", icon: <Gamepad2 className="w-8 h-8" />, timeline: "Q3 2024" },
    { name: "Patreon", icon: <Heart className="w-8 h-8" />, timeline: "Q4 2024" },
    { name: "Discord", icon: <MessageSquare className="w-8 h-8" />, timeline: "Q4 2024" },
    { name: "Shopify", icon: <ShoppingBag className="w-8 h-8" />, timeline: "Q1 2025" }
  ];

  const filteredIntegrations = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const [connectingItem, setConnectingItem] = useState(null);
  const [loginStep, setLoginStep] = useState('input'); // 'input', 'loading', 'success'
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleConnect = (item) => {
    setConnectingItem(item);
    setLoginStep('input');
    setCredentials({ username: '', password: '' });
  };

  const submitLogin = (e) => {
    e.preventDefault();
    setLoginStep('loading');
    setTimeout(() => {
      setLoginStep('success');
      setTimeout(() => {
        setConnectingItem(null);
        navigate('/dashboard');
      }, 1500);
    }, 2000);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Integrations | DripLens - Connect Your Toolkit</title>
        <meta name="description" content="Enhance your DripLens experience by connecting with Instagram, TikTok, Stripe, Slack, and more." />
      </Helmet>

      {/* Connection Modal */}
      <AnimatePresence>
        {connectingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConnectingItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white p-10 rounded-none border border-black shadow-2xl"
            >
              {loginStep === 'input' && (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-10 h-10 bg-gradient-to-br ${connectingItem.color} flex items-center justify-center text-white`}>
                      {connectingItem.icon}
                    </div>
                    <h3 className="text-2xl font-bold">Connect {connectingItem.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-8">Log in to your {connectingItem.name} account to sync your data with Driplens.</p>
                  
                  <form onSubmit={submitLogin} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Username or Email</label>
                      <input 
                        required
                        type="text" 
                        value={credentials.username}
                        onChange={e => setCredentials({...credentials, username: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:border-black transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
                      <input 
                        required
                        type="password" 
                        value={credentials.password}
                        onChange={e => setCredentials({...credentials, password: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:border-black transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                    <button type="submit" className="w-full py-4 bg-black text-white font-bold text-sm hover:opacity-90 transition-all mt-4">
                      LOG IN AND AUTHORIZE
                    </button>
                    <button 
                      type="button"
                      onClick={() => setConnectingItem(null)}
                      className="w-full py-2 text-gray-400 text-xs font-bold hover:text-black transition-all"
                    >
                      CANCEL
                    </button>
                  </form>
                </>
              )}

              {loginStep === 'loading' && (
                <div className="py-20 flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-6" />
                  <p className="text-black font-bold text-lg mb-2">Authenticating...</p>
                  <p className="text-gray-400 text-sm">Securely connecting to {connectingItem.name}</p>
                </div>
              )}

              {loginStep === 'success' && (
                <div className="py-20 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500 text-white flex items-center justify-center rounded-none mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <p className="text-black font-bold text-2xl mb-2">Connected!</p>
                  <p className="text-gray-400 text-sm">Your {connectingItem.name} profile is now synced.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider mb-6">
              <Cpu className="w-3 h-3" />
              Power up your workflow
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Connect your <span className="text-gray-500">ecosystem.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
              Seamlessly integrate DripLens with the tools you already use. 
              Sync portfolios, automate payouts, and track analytics in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-none text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-none bg-gray-50 border border-gray-100 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>
        </div>
      </section>

      {/* Available Integrations Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">Available Integrations</h2>
              <p className="text-gray-500">Ready to connect with your favorite services.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise-grade security</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredIntegrations.map((item, index) => (
                <motion.div
                  key={item.name}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="group relative p-8 rounded-none border border-gray-100 bg-white hover:border-black transition-all duration-300 hover:shadow-[0_24px_48px_-15px_rgba(0,0,0,0.08)] flex flex-col"
                >
                  <div className={`w-16 h-16 rounded-none bg-gradient-to-br ${item.color} p-4 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-black">{item.name}</h3>
                      <span className="px-2 py-0.5 rounded-none bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {item.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-none bg-gray-50 flex items-center justify-center">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleConnect(item)}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-none bg-black text-white font-bold text-sm hover:opacity-90 transition-all"
                  >
                    Connect {item.name}
                    <Plus className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex p-4 bg-gray-50 rounded-none mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No integrations found</h3>
              <p className="text-gray-500">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">On Our Roadmap</h2>
            <p className="text-gray-500">We're constantly expanding our ecosystem. See what's coming next.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoon.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-none bg-white border border-gray-100 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-none bg-gray-50 text-gray-400 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-black mb-1">{item.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.timeline}</p>
                <button className="mt-6 text-xs font-bold text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Get Notified
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise / API Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-none bg-gray-50 border border-gray-100 text-black p-12 md:p-20 overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-black/5 text-gray-500 text-xs font-bold uppercase tracking-wider mb-8">
                <Code2 className="w-3 h-3" />
                For Developers
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Build your own integration.
              </h2>
              <p className="text-xl text-gray-500 mb-12 leading-relaxed">
                Unlock the full power of DripLens with our robust API. 
                Custom integrations are available for Enterprise teams to sync with internal tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/pricing" 
                  className="px-10 py-5 bg-black text-white font-bold rounded-none hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  View Enterprise Plans
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a 
                  href="#" 
                  className="px-10 py-5 bg-white border border-gray-200 text-black font-bold rounded-none hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  API Documentation
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-black/5 rounded-none blur-3xl" />
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="pb-32 px-4 text-center">
        <div className="max-w-2xl mx-auto italic text-gray-500 text-lg">
          "Connecting Stripe and Instagram to DripLens changed our workflow. We went from manual invoicing to automated payouts in minutes."
          <div className="mt-4 not-italic flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-none bg-gray-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=000&color=fff" alt="Sarah Chen" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-black leading-none">Sarah Chen</span>
              <span className="text-xs text-gray-400">Founder, Velocity Creative</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
