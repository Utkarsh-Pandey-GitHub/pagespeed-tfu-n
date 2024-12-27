import React from 'react';
import { LineChart, MessageSquareText, BarChart3, Target, Star, CandlestickChart } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { motion, useInView as useFramerInView, Variants } from 'framer-motion';
import { useRef } from 'react';

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.99,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "bounce",
      stiffness: 100,
      damping: 10,
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const useInView = () => {
  const ref = useRef(null);
  const isInView = useFramerInView(ref, {
    amount: 0.1
  });

  return { ref, isInView };
};

export const gradients = {
  goldCard: "[background:linear-gradient(90deg,rgba(218,130,7,0.1)_0%,rgba(221,147,24,0.1)_9.33%,rgba(255,203,60,0.05)_69.8%)]",
  goldText: "bg-gradient-to-r from-[#F9BC2E] via-[#E29A1E] to-[#FFCD38] bg-clip-text text-transparent",
  goldBorder: "border-[#F9BC2E]/20",
  goldHover: "hover:border-[#F9BC2E]/40",
};


const resources = [
  {
    icon: LineChart,
    title: "Swing Trading Kit",
    description: "A comprehensive toolkit designed for swing traders, featuring advanced technical analysis tools, market trend indicators, and position sizing calculators. Perfect for traders focusing on multi-day to multi-week positions."
  },
  {
    icon: CandlestickChart,
    title:"Intraday Trading Kit",
    description: "Specialized toolkit for day traders, featuring real-time market data, intraday charting tools, and advanced order execution capabilities. Perfect for traders focusing on short-term trading opportunities."
  },
  {
    icon: MessageSquareText,
    title: "ChatGPT Prompts",
    description: "Curated collection of specialized prompts for market analysis, trading strategy development, and risk management. Leverage AI to enhance your trading decisions and market research capabilities."
  },
  {
    icon: BarChart3,
    title: "Stock Screener",
    description: "Advanced screening tool with customizable filters for technical and fundamental analysis. Identify potential trading opportunities with real-time market data and automated alerts for your preferred trading setups."
  },
  {
    icon: Target,
    title: "Trading Indicators",
    description: "Suite of professional-grade technical indicators for stock analysis. Includes momentum indicators, volume analysis tools, and custom oscillators designed specifically for swing trading strategies."
  },
];

const TradingResources: React.FC = () => {
  return (
    <section className="relative w-full py-24 px-6 md:px-28 overflow-hidden">
      
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle 
          title="Premium Trading Tools"
          subtitle="Access our comprehensive suite of professional trading resources"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              index={index}
              icon={resource.icon}
              title={resource.title}
              description={resource.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


interface SectionTitleProps {
  title: string;
  subtitle: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-16 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#F9BC2E]/50 to-transparent" />
      <div className={`text-4xl md:text-5xl font-bold mb-6 ${gradients.goldText} font-mono flex items-center justify-center`}>
        <Star className="w-4 h-4 inline-block mr-2 text-[#F9BC2E]" fill='#F9BC2E'/>
        <div>
        {title}
        </div>
        <Star className="w-4 h-4 inline-block ml-2 text-[#f9bc2e]" fill='#F9BC2E'/>
      </div>
      <div className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto italic">
        {subtitle}
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-transparent via-[#F9BC2E]/30 to-transparent"/>
    </div>
  );
};

interface ResourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ icon: Icon, title, description, index }) => {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      className={`
        p-8 rounded-lg ${gradients.goldCard} backdrop-blur-sm 
        border ${gradients.goldBorder} ${gradients.goldHover}
        transition-all duration-300 relative group
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-[#F9BC2E]/5 blur-xl rounded-lg 
                    md:group-hover:bg-[#F9BC2E]/10 transition-all duration-300" />
      
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-lg bg-[#F9BC2E]/10">
          <Icon className="w-8 h-8 text-[#F9BC2E]" />
        </div>
        <h2 className={`text-2xl font-semibold ml-4 ${gradients.goldText} !text-white `}>
          {title}
        </h2>
      </div>
      
      <p className="text-gray-300/90 leading-relaxed text-balance ">
        {description}
      </p>
    </motion.div>
  );
};


export default TradingResources;