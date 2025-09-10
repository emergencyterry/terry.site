import { useState } from "react";
import AsciiHeader from "@/components/ascii-header";
import Navigation from "@/components/navigation";
import BiographySection from "@/components/biography-section";
import VmSection from "@/components/vm-section";
import LegacySection from "@/components/legacy-section";

import EmulatorSection from "@/components/emulator-section";

export default function Home() {
  const [activeSection, setActiveSection] = useState<'biography' | 'vm' | 'legacy' | 'emulator'>('biography');

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <AsciiHeader />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="max-w-6xl mx-auto px-4">
        {activeSection === 'biography' && <BiographySection />}
        {activeSection === 'vm' && <VmSection />}
        {activeSection === 'legacy' && <LegacySection />}
        {activeSection === 'emulator' && <EmulatorSection />}
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
