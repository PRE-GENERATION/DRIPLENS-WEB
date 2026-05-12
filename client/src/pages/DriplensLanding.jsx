import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const DriplensLanding = () => {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-[#050508] min-h-screen text-white font-sans selection:bg-[#ccff00] selection:text-black overflow-hidden relative">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-20 px-6">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yBg }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050508]/80 to-[#050508] z-10" />
          <img 
            src="/orgo_bg_sky_1776872841857.png" 
            className="w-full h-[120vh] object-cover opacity-60" 
            alt="Sky background" 
          />
        </motion.div>

        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-purple-600/30 blur-[150px] rounded-full z-0" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-600/30 blur-[150px] rounded-full z-0" />

        <div className="relative z-20 text-center flex flex-col items-center w-full max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[12vw] leading-[1] md:text-8xl lg:text-[9rem] font-bold tracking-tighter text-[#ccff00] mb-6"
          >
            The Divinity <br /> of Purpose
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 max-w-lg mb-16"
          >
            Meaningful design is not an accident. We build brands directed by higher purpose and absolute precision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-64 hidden lg:block"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src="/orgo_man_phone_1776872862504.png" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Active Project</p>
                <p className="font-semibold text-sm">R24 Creative</p>
              </div>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="w-[72%] bg-[#ccff00] h-full" />
            </div>
            <p className="text-xs text-right mt-2 text-gray-400">72% Completed</p>
          </motion.div>
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section id="ethos" className="py-32 px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-3xl md:text-5xl font-medium tracking-tight text-white/90 leading-tight"
          >
            "Nothing starts finished. <br/> <span className="text-[#ccff00]">Everything evolves.</span>"
          </motion.h2>
        </div>
      </section>

      {/* 3. Process Showcase */}
      <section id="process" className="py-24 px-6 relative z-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        >
          <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hidden md:block">
            <h3 className="text-xl font-bold mb-4">01. Discovery</h3>
            <p className="text-gray-400 text-sm">Unearthing the core truth of your brand before rendering a single pixel.</p>
          </motion.div>

          <motion.div variants={fadeIn} className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative bg-black rounded-3xl overflow-hidden aspect-[4/5] border border-white/20">
              <img src="/orgo_woman_047_1776872882992.png" alt="Process 047" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-6xl font-black text-white/90 tracking-tighter">047</p>
                <p className="text-[#ccff00] font-mono text-xs uppercase mt-2 tracking-widest">Iterative Process</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-3xl p-2 backdrop-blur-md hidden md:block aspect-square relative overflow-hidden">
             <img src="/orgo_flower_art_1776872899932.png" alt="Detail art" className="w-full h-full object-cover rounded-2xl opacity-70" />
             <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
               <p className="text-sm font-medium">From raw ideas to final form, each work is shaped with delicate intention.</p>
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Manifesto Section */}
      <section className="py-32 px-6 relative z-20 border-y border-white/10 bg-[#020204]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter flex-1"
          >
            Design is a process, <br/> not a fixed outcome.
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <button className="border border-white/30 rounded-full px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-white hover:text-black transition duration-300 flex items-center gap-3">
              Read Manifesto <span className="text-[#ccff00] text-lg leading-none">→</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 5. Projects / Work Section */}
      <section id="work" className="py-32 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-bold tracking-tighter">Selected <br/> <span className="text-gray-500">Works</span></h2>
             <span className="text-[#ccff00] font-mono">[2024—2026]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#ccff00] rounded-3xl p-8 text-black aspect-square flex flex-col justify-between group overflow-hidden relative cursor-pointer"
            >
              <div>
                <p className="text-xs font-mono uppercase border border-black/20 self-start px-3 py-1 rounded-full inline-block">Branding</p>
                <h3 className="text-3xl font-bold mt-4 leading-tight">Designing a<br/>living brand<br/>identity</h3>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-6xl font-black opacity-20 group-hover:opacity-100 transition duration-300">021</span>
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-[#ccff00] group-hover:scale-110 transition duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl rounded-tr-[4rem] text-black aspect-square flex flex-col justify-between group overflow-hidden relative cursor-pointer"
            >
              <div className="p-8 pb-0 z-10 relative">
                <p className="text-xs font-mono uppercase text-[#ccff00] bg-black px-3 py-1 rounded-full inline-block">Digital Campaign</p>
                <h3 className="text-3xl font-bold mt-4 text-[#ccff00] mix-blend-difference">To the Stars</h3>
              </div>
              <img src="/orgo_highfive_1776872917645.png" alt="To the Stars" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 aspect-square flex flex-col justify-between group overflow-hidden relative cursor-pointer"
            >
              <div className="flex justify-between">
                 <h3 className="text-6xl font-bold text-[#ccff00] tracking-tighter">150M</h3>
                 <p className="text-xs font-mono text-gray-500 uppercase text-right">Impressions<br/>Generated</p>
              </div>
              
              <div className="h-20 w-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBMMjAgMEwyMCAyMEgwWiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat-x bg-bottom" />

              <h3 className="text-xl font-medium leading-tight">The result of process and absolute intention.</h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Services Section */}
      <section className="bg-white text-black py-32 px-6 relative z-20 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-16 mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight flex-1">
              Built through process,<br/>delivered with clarity.
            </h2>
            <div className="flex-1 text-gray-500 font-medium">
              We leverage modern technology, profound strategy, and unrestricted imagination to build digital entities that last.
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
            {['Brand Systems', 'Digital Experiences', 'Motion & Expression', 'Strategic Thinking'].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ backgroundColor: '#f9f9f9' }}
                className="bg-white p-12 transition group"
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-bold tracking-tight">{service}</h3>
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
                <p className="text-gray-500">Robust architectures and visual languages tailored for the next era of digital existence. Grounded in research, elevated by design.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA / Footer Section */}
      <section className="bg-[#050508] py-32 px-6 relative z-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-white/10 to-transparent blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-bold tracking-tighter mb-12 text-[#ccff00]"
          >
            Let's create something <br/> <span className="text-white">meaningful.</span>
          </motion.h2>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest mb-24 hover:bg-[#ccff00] transition duration-300"
          >
            Get in Touch
          </motion.button>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 mt-12 text-sm text-gray-500 font-mono">
          <div className="flex gap-8 mb-4 md:mb-0">
            <a href="/" className="hover:text-white transition">Instagram</a>
            <a href="/" className="hover:text-white transition">Twitter / X</a>
            <a href="/" className="hover:text-white transition">LinkedIn</a>
          </div>
          <p className="uppercase text-center md:text-right">
            More than work,<br/><span className="text-[#ccff00]">a pursuit of higher purpose.</span>
          </p>
          <div className="text-center md:text-right mt-4 md:mt-0 font-sans text-9xl font-black text-white/5 tracking-tighter absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none">
            DRIPLENS
          </div>
        </div>
      </section>
    </div>
  );
};

export default DriplensLanding;