import { useState } from 'react';

export default function AsciiHeader() {
  const splashTexts = [
    "GREEN PARTY HEADQUARTERS (THIS IS OUR YEAR!)",
    "NICK FUENTES APPROVED!",
    "CENSORSHIP-PROOF",
    "EMBRACE W THOUGHT",
    "HASANABI DEBATED!",
    "WE ARE CHECKING...",
    "YOU WILL EAT ZE BUGS!",
    "ADRENOCHROME SO GOOD!",
    "YOU WILL OWN NOTHING UND BE HAPPY!",
    "GENEROUSLY DONATED BY THE GATES FOUNDATION"
  ];

  // Pick a random splash text on component mount
  const [currentSplash] = useState(() => Math.floor(Math.random() * splashTexts.length));

  const goToHome = () => {
    window.location.hash = '/';
  };

  return (
    <div className="text-center py-4 terminal-green ascii-art relative">
      <pre 
        className="text-[8px] leading-none cursor-pointer hover:opacity-80 transition-opacity duration-200"
        onClick={goToHome}
        data-testid="ascii-logo"
        title="Click to return home"
      >
{`████████╗███████╗██████╗ ██████╗ ██╗   ██╗     █████╗     ██████╗  █████╗ ██╗   ██╗██╗███████╗
╚══██╔══╝██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝    ██╔══██╗    ██╔══██╗██╔══██╗██║   ██║██║██╔════╝
   ██║   █████╗  ██████╔╝██████╔╝ ╚████╔╝     ███████║    ██║  ██║███████║██║   ██║██║███████╗
   ██║   ██╔══╝  ██╔══██╗██╔══██╗  ╚██╔╝      ██╔══██║    ██║  ██║██╔══██║╚██╗ ██╔╝██║╚════██║
   ██║   ███████╗██║  ██║██║  ██║   ██║       ██║  ██║    ██████╔╝██║  ██║ ╚████╔╝ ██║███████║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝`}
      </pre>
      
      {/* Splash Text - Minecraft Style */}
      <div 
        className="absolute top-4 right-4 text-yellow-400 text-sm font-bold transform rotate-12 pointer-events-none select-none opacity-90"
        style={{
          textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
          fontFamily: 'monospace',
          animation: 'pulse 2s infinite',
        }}
        data-testid="splash-text"
      >
        {splashTexts[currentSplash]}
      </div>

      <div className="terminal-amber text-2xl mt-2 font-bold">
        terry.site
      </div>
      <div className="terminal-cyan text-sm mt-2">
        DEDICATED TO GOD'S LONELY PROGRAMMER
      </div>
      
      {/* Terry Davis Dancing GIF */}
      <div className="mt-5">
        <img 
          src="https://media.tenor.com/f5O5S8f_lS0AAAAj/terry-davis-dancing.gif" 
          alt="Terry Davis Dancing" 
          className="max-w-[200px] h-auto mx-auto border-2 border-terminal-green"
          style={{ boxShadow: '0 0 10px var(--terminal-green)' }}
          data-testid="terry-dancing-gif" 
        />
      </div>
    </div>
  );
}
