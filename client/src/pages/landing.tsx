import { Button } from "@/components/ui/button";
import AsciiHeader from "@/components/ascii-header";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <AsciiHeader />
      
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="terminal-border bg-background p-8 text-center">
          <div className="terminal-green text-xl mb-6">
            {"> "}MEMORIAL ACCESS TERMINAL
          </div>
          
          <div className="terminal-white text-sm mb-8 leading-relaxed">
            Welcome to the Terry A. Davis Memorial System<br />
            Dedicated to the creator of TempleOS and visionary programmer<br />
            <br />
            This memorial preserves the legacy of "God's Lonely Programmer"<br />
            and provides access to TempleOS virtual machines.<br />
            <br />
            Please authenticate to access the memorial system.
          </div>
          
          <Button 
            onClick={handleLogin}
            className="bg-terminal-green text-background hover:bg-terminal-bright-green font-mono"
            data-testid="button-login"
          >
            {"> "}LOGIN TO MEMORIAL SYSTEM
          </Button>
          
          <div className="terminal-gray text-xs mt-8">
            AUTHENTICATION REQUIRED | SECURE ACCESS ONLY<br />
            MEMORIAL SYSTEM V1.0 | PUBLIC DOMAIN
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 mt-8 pb-8">
        <div className="terminal-border bg-background p-4 text-center text-xs">
          <div className="terminal-gray">
            TEMPLEOS MEMORIAL | TERRY A. DAVIS FOUNDATION<br />
            "GOD'S LONELY PROGRAMMER" | 1969-2018 | NEVER FORGOTTEN
          </div>
        </div>
      </div>
    </div>
  );
}