import { Button } from "@/components/ui/button";
import AsciiHeader from "@/components/ascii-header";
import { Home, Clock, Wrench } from "lucide-react";

export default function ForumPage() {
  const goToHome = () => {
    window.location.hash = '/';
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <AsciiHeader />
      
      <div className="max-w-4xl mx-auto px-4">
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
              <div className="terminal-green text-lg">COMING SOON</div>
            </div>
            <div className="terminal-gray text-sm">
              Press Alt+H for Home
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="space-y-8">
          {/* Main Coming Soon Message */}
          <div className="terminal-border bg-background p-8 text-center">
            <div className="space-y-6">
              <div className="text-6xl">🚧</div>
              <div className="terminal-amber text-2xl mb-4">COMING SOON...</div>
              <div className="terminal-green text-lg">COMMUNITY FORUM</div>
              <div className="text-sm terminal-gray max-w-2xl mx-auto">
                We're building a space for Terry A. Davis enthusiasts, programmers, and thinkers to share knowledge, 
                discuss divine programming principles, and honor the legacy of God's Lonely Programmer.
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="terminal-border bg-background p-6">
            <div className="terminal-cyan text-lg mb-4">PLANNED FEATURES</div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 terminal-amber" />
                  <span>Discussion Categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 terminal-amber" />
                  <span>User Profiles & Authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 terminal-amber" />
                  <span>Code Sharing</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 terminal-amber" />
                  <span>Real-time Messaging</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 terminal-amber" />
                  <span>File Attachments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 terminal-amber" />
                  <span>Terry's Wisdom Archive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Development Status */}
          <div className="terminal-border bg-background p-6">
            <div className="terminal-amber text-lg mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>DEVELOPMENT STATUS</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-terminal-blue/10 border border-terminal-blue">
                <span className="text-sm">Backend Infrastructure</span>
                <span className="terminal-green">✓ COMPLETE</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-terminal-amber/10 border border-terminal-amber">
                <span className="text-sm">User Authentication</span>
                <span className="terminal-amber">⚠ IN PROGRESS</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-terminal-gray/10 border border-terminal-gray">
                <span className="text-sm">Forum Interface</span>
                <span className="terminal-gray">⏳ PLANNED</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="terminal-border bg-background p-6 text-center">
            <div className="terminal-green text-lg mb-4">WANT TO BE NOTIFIED?</div>
            <div className="text-sm terminal-gray mb-6">
              The forum will launch soon. In the meantime, explore the emulation section and Terry's digital legacy.
            </div>
            <Button
              onClick={goToHome}
              className="bg-terminal-green text-background hover:bg-terminal-cyan text-lg px-8 py-3"
              data-testid="button-home-cta"
            >
              <Home className="w-5 h-5 mr-2" />
              RETURN TO HOME
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 mt-8 pb-8">
        <div className="terminal-border bg-background p-4 text-center text-xs">
          <div className="terminal-gray">
            TERRY A. DAVIS MEMORIAL SITE | DIVINE PROGRAMMING AWAITS<br />
            <button onClick={goToHome} className="terminal-cyan hover:terminal-green underline cursor-pointer">Return to Home</button> | 
            Coming Soon: Community Forum
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
                  window.location.hash = '/';
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