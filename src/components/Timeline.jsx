import React from 'react';
import { motion } from 'framer-motion';

const Timeline = ({ milestones }) => {
  return (
    <div className="relative container mx-auto px-4 py-16">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-200" />

      <div className="space-y-12">
        {milestones.map((milestone, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Spacer for desktop alignment */}
              <div className="hidden md:block w-1/2" />

              {/* Dot on the line */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-corporate-yellow border-4 border-white shadow-lg z-10" />

              {/* Content Card */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className={`bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group ${
                   isEven ? 'text-left md:text-right' : 'text-left'
                }`}>
                  <div className="absolute top-0 left-0 w-1 h-full bg-corporate-blue group-hover:bg-corporate-yellow transition-colors duration-300" />
                  
                  <span className="text-3xl font-bold text-slate-200 absolute top-2 right-4 group-hover:text-slate-100 transition-colors select-none">
                    {milestone.year}
                  </span>
                  
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-corporate-blue text-sm font-bold mb-2">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">
                      {milestone.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;