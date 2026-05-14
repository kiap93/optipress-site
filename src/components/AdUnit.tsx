import { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdUnit = ({ slot, format = 'auto', className = '', style }: AdUnitProps) => {
  useEffect(() => {
    // We use a small delay to ensure the DOM element is actually rendered and available
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          // Check if this unit has already been pushed to avoid errors
          const insElement = document.querySelector(`ins[data-ad-slot="${slot}"]`);
          if (insElement && !insElement.innerHTML.trim()) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div 
      className={`ad-container w-full flex justify-center overflow-visible ${className}`} 
      style={{ 
        minHeight: style?.height || 'auto',
        textAlign: 'center',
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          width: '100%', 
          ...style 
        }}
        data-ad-client="ca-pub-1430587625650027"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
