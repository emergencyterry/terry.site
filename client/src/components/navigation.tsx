import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeSection: 'biography' | 'vm' | 'legacy';
  onSectionChange: (section: 'biography' | 'vm' | 'legacy') => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 mb-6">
      <div className="terminal-border bg-background p-4">
        <div className="terminal-green mb-2">C:\TERRY_DAVIS&gt; NAVIGATE</div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Button
            onClick={() => onSectionChange('biography')}
            variant="outline"
            className={`px-3 py-1 text-xs border ${
              activeSection === 'biography'
                ? 'terminal-green border-terminal-green'
                : 'terminal-cyan border-terminal-cyan hover:terminal-green hover:border-terminal-green'
            } bg-transparent`}
            data-testid="button-biography"
          >
            [B]IOGRAPHY
          </Button>
          <Button
            onClick={() => onSectionChange('vm')}
            variant="outline"
            className={`px-3 py-1 text-xs border ${
              activeSection === 'vm'
                ? 'terminal-green border-terminal-green'
                : 'terminal-cyan border-terminal-cyan hover:terminal-green hover:border-terminal-green'
            } bg-transparent`}
            data-testid="button-vm"
          >
            [V]IRTUAL MACHINE
          </Button>
          <Button
            onClick={() => onSectionChange('legacy')}
            variant="outline"
            className={`px-3 py-1 text-xs border ${
              activeSection === 'legacy'
                ? 'terminal-green border-terminal-green'
                : 'terminal-cyan border-terminal-cyan hover:terminal-green hover:border-terminal-green'
            } bg-transparent`}
            data-testid="button-legacy"
          >
            [L]EGACY
          </Button>
        </div>
      </div>
    </div>
  );
}
