export default function BiographySection() {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">BIOGRAPHICAL DATA</div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="terminal-amber mb-2">PERSONAL INFORMATION:</div>
            <div className="text-sm space-y-1">
              <div>NAME: Terrence Andrew Davis</div>
              <div>BORN: December 15, 1969 - West Allis, Wisconsin</div>
              <div>DIED: August 11, 2018 (Age 48)</div>
              <div>EDUCATION: Arizona State University (B.S., M.S. Electrical Engineering)</div>
              <div>GPA: 3.63 | SAT: 1440</div>
            </div>
          </div>
          <div>
            <div className="terminal-amber mb-2">CAREER TIMELINE:</div>
            <div className="text-sm space-y-1">
              <div>1990-1996: Ticketmaster (VAX Programmer)</div>
              <div>1993-2017: TempleOS Development</div>
              <div>1996: Mental Health Crisis</div>
              <div>2004-2018: OS Evolution (J OS → LoseThos → SparrowOS → TempleOS)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Achievements */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">TECHNICAL ACHIEVEMENTS</div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-terminal-blue p-4">
            <div className="terminal-cyan mb-2">HOLLYC LANGUAGE</div>
            <div className="text-xs">
              • Created original programming language<br />
              • Middle ground between C and C++<br />
              • Originally called "C+" (C Plus)<br />
              • Renamed to "Holy C"
            </div>
          </div>
          <div className="border border-terminal-blue p-4">
            <div className="terminal-cyan mb-2">TEMPLEOS SPECS</div>
            <div className="text-xs">
              • 64-bit operating system<br />
              • 120,000+ lines of code<br />
              • 640x480 VGA, 16 colors<br />
              • Single address space<br />
              • Ring-0 only, non-networked
            </div>
          </div>
          <div className="border border-terminal-blue p-4">
            <div className="terminal-cyan mb-2">COMPLETE SYSTEM</div>
            <div className="text-xs">
              • Custom kernel & compiler<br />
              • Built-in editor & debugger<br />
              • Flight simulator included<br />
              • 3D graphics library<br />
              • Sprite & mesh editors
            </div>
          </div>
        </div>
      </div>

      {/* Industry Recognition */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">INDUSTRY RECOGNITION</div>
        <div className="space-y-3 text-sm">
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber">"TempleOS is a testament to the dedication and passion of one man displaying his technological prowess."</div>
            <div className="terminal-gray">- James Sanders, TechRepublic</div>
          </div>
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber">"Davis was clearly a gifted programmer – writing an entire operating system is no small feat."</div>
            <div className="terminal-gray">- Thom Holwerda, OSNews</div>
          </div>
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber">"Compared the development of TempleOS to a one-man-built skyscraper."</div>
            <div className="terminal-gray">- Computer Engineer, Community Member</div>
          </div>
        </div>
      </div>
    </div>
  );
}
