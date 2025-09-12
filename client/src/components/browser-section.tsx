import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Globe } from 'lucide-react';

export default function BrowserSection() {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [history, setHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const bookmarks = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
    { name: 'Archive.org', url: 'https://archive.org' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com' },
    { name: 'Reddit', url: 'https://www.reddit.com' }
  ];

  const navigate = (newUrl: string) => {
    setCurrentUrl(newUrl);
    setUrl(newUrl);
    
    // Add to history if it's a new URL
    if (newUrl !== history[historyIndex]) {
      const newHistory = [...history.slice(0, historyIndex + 1), newUrl];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevUrl = history[newIndex];
      setCurrentUrl(prevUrl);
      setUrl(prevUrl);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setCurrentUrl(nextUrl);
      setUrl(nextUrl);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let processedUrl = url.trim();
    
    // Add protocol if missing
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    navigate(processedUrl);
  };

  const goHome = () => {
    navigate('https://www.google.com');
  };

  return (
    <div className="space-y-6">
      {/* Browser Header */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">VIRTUAL BROWSER SYSTEM</div>
        <div className="terminal-amber text-sm mb-4 p-3 border border-terminal-amber bg-terminal-amber/10">
          ⚠️ This is a virtual browser interface. Some sites may not load due to CORS restrictions or iframe policies.
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="terminal-amber mb-2">FEATURES:</div>
            <div className="text-sm space-y-1">
              <div>• Full web browsing capability</div>
              <div>• Navigation history</div>
              <div>• Bookmark shortcuts</div>
              <div>• Cross-site compatibility</div>
            </div>
          </div>
          <div>
            <div className="terminal-amber mb-2">LIMITATIONS:</div>
            <div className="text-sm space-y-1">
              <div>• Some sites block iframe embedding</div>
              <div>• Limited by browser security policies</div>
              <div>• No download functionality</div>
              <div>• Basic navigation only</div>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Interface */}
      <div className="terminal-border bg-background p-4">
        <div className="space-y-4">
          {/* Browser Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="bg-terminal-blue text-background hover:bg-terminal-cyan disabled:opacity-50 p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className="bg-terminal-blue text-background hover:bg-terminal-cyan disabled:opacity-50 p-2"
              data-testid="button-forward"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={refresh}
              className="bg-terminal-magenta text-background hover:bg-terminal-cyan p-2"
              data-testid="button-refresh"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={goHome}
              className="bg-terminal-green text-background hover:bg-terminal-cyan p-2"
              data-testid="button-home"
            >
              <Home className="w-4 h-4" />
            </Button>
            
            {/* Address Bar */}
            <form onSubmit={handleUrlSubmit} className="flex-1 flex">
              <div className="flex-1 relative">
                <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-cyan" />
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL..."
                  className="pl-8 bg-background border-terminal-blue text-terminal-green"
                  data-testid="input-url"
                />
              </div>
              <Button
                type="submit"
                className="ml-2 bg-terminal-amber text-background hover:bg-terminal-cyan"
                data-testid="button-navigate"
              >
                GO
              </Button>
            </form>
          </div>

          {/* Bookmarks */}
          <div className="border-t border-terminal-blue pt-2">
            <div className="terminal-cyan text-xs mb-2">QUICK ACCESS:</div>
            <div className="flex flex-wrap gap-2">
              {bookmarks.map((bookmark) => (
                <Button
                  key={bookmark.name}
                  onClick={() => navigate(bookmark.url)}
                  className="text-xs px-3 py-1 bg-terminal-gray/20 text-terminal-cyan hover:bg-terminal-blue hover:text-background"
                  data-testid={`bookmark-${bookmark.name.toLowerCase()}`}
                >
                  {bookmark.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Browser Window */}
          <div className="bg-black border-2 border-terminal-blue" style={{ height: '600px' }}>
            <iframe
              ref={iframeRef}
              src={currentUrl}
              className="w-full h-full"
              title="Virtual Browser"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              data-testid="browser-iframe"
            />
          </div>

          {/* Status Bar */}
          <div className="border-t border-terminal-blue pt-2 text-xs terminal-gray">
            <div className="flex justify-between">
              <div>Current: <span className="terminal-green">{currentUrl}</span></div>
              <div>History: <span className="terminal-amber">{historyIndex + 1}/{history.length}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Info */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">DIVINE BROWSING PHILOSOPHY</div>
        <div className="space-y-4 text-sm">
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber mb-2">SIMPLICITY IN ACCESS:</div>
            <div>"The internet should be accessible through simple, direct means. No complex layers, no unnecessary abstractions - just pure connection to information."</div>
          </div>
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber mb-2">FREEDOM OF INFORMATION:</div>
            <div>"Every programmer deserves unfettered access to knowledge. The web is a library, and this browser is your reading terminal."</div>
          </div>
        </div>
      </div>
    </div>
  );
}