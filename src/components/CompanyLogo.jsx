import React from 'react';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

const CompanyLogo = ({ company, className, showText = true }) => {
  // If logo exists, use white background to ensure transparency/visibility for SVG/PNGs.
  // Otherwise use company color.
  const hasLogo = !!company.logo;
  const bgColor = hasLogo ? 'bg-white' : (company.color || 'bg-corporate-blue');
  
  return (
    <div className="flex flex-col items-center group max-w-full">
      <div className={cn(
        `flex items-center justify-center shadow-lg rounded-[14px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl aspect-square overflow-hidden relative border border-gray-100/50 shrink-0`,
        bgColor,
        className
      )}>
        {hasLogo ? (
          <img 
            src={company.logo} 
            alt={`${company.name} logo`}
            className="w-full h-full object-contain p-3 max-w-full max-h-full"
            loading="lazy" 
          />
        ) : (
          <div className="text-center p-4 w-full h-full flex flex-col items-center justify-center">
            <Building2 className="w-1/2 h-1/2 mb-2 text-white/80" />
            {!showText && (
               <span className="text-white font-bold text-xs uppercase tracking-wider truncate max-w-full px-1">{company.name.substring(0, 3)}</span>
            )}
          </div>
        )}
        
        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
      </div>
      
      {showText && (
        <div className="text-center mt-4 max-w-full overflow-hidden">
          <h3 className="text-lg font-bold text-corporate-blue heading-font leading-tight truncate px-2">{company.name}</h3>
          <span className="text-sm text-gray-500 font-mono mt-1 block">{company.founded}</span>
        </div>
      )}
    </div>
  );
};

export default CompanyLogo;