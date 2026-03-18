import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center max-w-5xl mx-auto flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-black mb-8"
        >
          The Professional <br/> Meritocracy for Creators
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-[#555555] max-w-2xl mb-10"
        >
          Showcase your portfolio, get discovered by top brands, and unlock zero-ambiguity creative partnerships.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <AnimatedButton to="/auth?mode=register&role=creator">
            Join as Creator
          </AnimatedButton>
          <AnimatedButton to="/auth?mode=register&role=brand">
            Hire Talent
          </AnimatedButton>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 border-y border-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-black mb-1">10k+</h2>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#666]">Verified Creators</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-black mb-1">$5M+</h2>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#666]">Paid to Talent</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-black mb-1">500+</h2>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#666]">Top Brands</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-black mb-1">24h</h2>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#666]">Avg. Match Time</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Driplens Works</h2>
            <p className="text-[#555555] max-w-2xl mx-auto">A seamless bridge between world-class creative talent and forward-thinking brands.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Creators */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-4">
                <span className="w-10 h-10 bg-black text-white flex items-center justify-center text-sm font-bold">01</span>
                For Creators
              </h3>
              <div className="space-y-6">
                {[
                  { title: "Build Your Identity", desc: "Create a stunning, data-backed portfolio that showcases your best work and professional history." },
                  { title: "Get Discovered", desc: "Our algorithm matches your unique style and skills with brands looking for your exact expertise." },
                  { title: "Work Seamlessly", desc: "Execute projects with zero ambiguity using our structured milestone and payment system." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-0.5 bg-black/10 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-lg text-black mb-1">{step.title}</h4>
                      <p className="text-sm text-[#555555] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Brands */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-4">
                <span className="w-10 h-10 border-2 border-black text-black flex items-center justify-center text-sm font-bold">02</span>
                For Brands
              </h3>
              <div className="space-y-6">
                {[
                  { title: "Define Your Vision", desc: "Post detailed briefs and set clear expectations for your creative projects." },
                  { title: "Source Elite Talent", desc: "Access a curated pool of verified creators vetted for quality, reliability, and professionalism." },
                  { title: "Scalable Creation", desc: "Manage multiple workstreams and creators from a single, unified dashboard." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-0.5 bg-black shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-lg text-black mb-1">{step.title}</h4>
                      <p className="text-sm text-[#555555] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 border-y border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Zero Ambiguity", desc: "Crystal clear contracts and milestone-based workflows ensure everyone is on the same page." },
              { title: "Verified Merit", desc: "No more guessing. Portfolios are verified and backed by real project data and brand feedback." },
              { title: "Global Network", desc: "Connect with the world's most innovative brands and most talented creators in one place." }
            ].map((feature, i) => (
              <div key={i} className="text-center md:text-left group">
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-8 mx-auto md:mx-0 transition-transform group-hover:-translate-y-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#555555] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolios Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Elite Talent. <br/>Proven Results.</h2>
            <p className="text-[#555555]">Explore the work of creators who are redefining their industry on Driplens.</p>
          </div>
          <Link to="/explore" className="text-black font-bold border-b-2 border-black pb-1 hover:opacity-70 transition-opacity">View all creators</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Alex Rivier", role: "Cinematographer", img: "bg-slate-200" },
            { name: "Sarah Chen", role: "Brand Identity", img: "bg-stone-200" },
            { name: "Marcus Thorne", role: "3D Motion Artist", img: "bg-zinc-200" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="overflow-hidden group cursor-pointer block"
            >
              <div className={`aspect-[4/5] ${item.img} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                   <span className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest shadow-2xl">View Project</span>
                </div>
              </div>
              <div className="py-6 flex items-center justify-between border-b border-black/5 group-hover:border-black transition-colors">
                <div>
                  <h3 className="font-bold text-xl text-black mb-1">{item.name}</h3>
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#999999]">{item.role}</p>
                </div>
                <div className="w-12 h-12 border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#999999] mb-4 block">Testimonials</span>
                <h2 className="text-4xl font-bold mb-8 leading-tight">Trusted by the next <br/> generation of creators.</h2>
                <div className="space-y-8">
                  <blockquote className="border-l-4 border-black pl-8 py-2">
                    <p className="text-xl italic text-black mb-4">"Driplens eliminated the back-and-forth ambiguity. I focus on my craft, and the platform handles the professional structure."</p>
                    <footer className="font-bold text-black">— Elena Rossi, Independent Filmmaker</footer>
                  </blockquote>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-[3/4] bg-gray-100 mt-12"></div>
                 <div className="aspect-[3/4] bg-gray-50 mb-12"></div>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to step into the <br/> professional meritocracy?</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">Join thousands of elite creators and brands building the future of creative work today.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <AnimatedButton to="/auth?mode=register&role=creator" className="!bg-white !text-black">
                Get Started as Creator
              </AnimatedButton>
              <AnimatedButton to="/auth?mode=register&role=brand" className="!bg-transparent border-2 border-white !text-white">
                Register as Brand
              </AnimatedButton>
          </div>
        </div>
      </section>
    </div>
  );
}
