import { Button } from "@/components/ui/button";
import AsciiHeader from "@/components/ascii-header";
import ForumSection from "@/components/forum/forum-section";
import { ArrowLeft, Home } from "lucide-react";

export default function ForumPage() {
  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <AsciiHeader />
      
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Header */}
        <div className="terminal-border bg-background p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={goToHome}
                variant="outline"
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-background"
                data-testid="button-home"
              >
                <Home className="w-4 h-4 mr-2" />
                HOME
              </Button>
              <div className="terminal-green text-lg">COMMUNITY FORUM</div>
            </div>
            <div className="terminal-gray text-sm">
              Press Alt+F to navigate • Alt+H for Home
            </div>
          </div>
        </div>

        {/* Forum Content */}
        <ForumSection />
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-8">
        <div className="terminal-border bg-background p-4 text-center text-xs">
          <div className="terminal-gray">
            TERRY A. DAVIS FORUM | COMMUNITY DRIVEN | GOD'S LONELY PROGRAMMER LIVES ON<br />
            <a href="/" className="terminal-cyan hover:terminal-green underline">Return to Home</a> | 
            Share Knowledge | Honor His Legacy
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('keydown', function(e) {
            if (e.altKey) {
              switch(e.key.toLowerCase()) {
                case 'h':
                  window.location.href = '/';
                  e.preventDefault();
                  break;
                case 'f':
                  // Already on forum page
                  e.preventDefault();
                  break;
              }
            }
          });
        `
      }} />
    </div>
  );
}