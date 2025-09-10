import { useState } from "react";
import { Button } from "@/components/ui/button";
import AsciiHeader from "@/components/ascii-header";
import Navigation from "@/components/navigation";
import BiographySection from "@/components/biography-section";
import VmSection from "@/components/vm-section";
import LegacySection from "@/components/legacy-section";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [activeSection, setActiveSection] = useState<'biography' | 'vm' | 'legacy'>('biography');
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <AsciiHeader />
      
      {/* User info and logout */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div className="terminal-border bg-background p-3 flex justify-between items-center">
          <div className="terminal-green text-sm">
            {"> "}AUTHENTICATED USER: {user?.email || "Unknown User"}
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            data-testid="button-logout"
          >
            LOGOUT
          </Button>
        </div>
      </div>
      
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="max-w-6xl mx-auto px-4">
        {activeSection === 'biography' && <BiographySection />}
        {activeSection === 'vm' && <VmSection />}
        {activeSection === 'legacy' && <LegacySection />}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-8">
        <div className="terminal-border bg-background p-4 text-center text-xs">
          <div className="terminal-gray">
            MEMORIAL SYSTEM V1.0 | IN MEMORY OF TERRY A. DAVIS | TEMPLEOS FOREVER<br />
            PUBLIC DOMAIN | COMMUNITY MAINTAINED | GOD'S LONELY PROGRAMMER LIVES ON
          </div>
        </div>
      </div>
    </div>
  );
}
