export default function AsciiHeader() {
  return (
    <div className="text-center py-4 terminal-green ascii-art">
      <pre className="text-[8px] leading-none">
{`████████╗███████╗██████╗ ██████╗ ██╗   ██╗     █████╗     ██████╗  █████╗ ██╗   ██╗██╗███████╗
╚══██╔══╝██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝    ██╔══██╗    ██╔══██╗██╔══██╗██║   ██║██║██╔════╝
   ██║   █████╗  ██████╔╝██████╔╝ ╚████╔╝     ███████║    ██║  ██║███████║██║   ██║██║███████╗
   ██║   ██╔══╝  ██╔══██╗██╔══██╗  ╚██╔╝      ██╔══██║    ██║  ██║██╔══██║╚██╗ ██╔╝██║╚════██║
   ██║   ███████╗██║  ██║██║  ██║   ██║       ██║  ██║    ██████╔╝██║  ██║ ╚████╔╝ ██║███████║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝`}
      </pre>
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
