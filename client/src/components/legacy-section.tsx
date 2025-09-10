export default function LegacySection() {
  return (
    <div className="space-y-6">
      {/* Programming Philosophy */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">PROGRAMMING PHILOSOPHY</div>
        <div className="space-y-4 text-sm">
          <div className="border-l-2 border-terminal-cyan pl-4">
            <div className="terminal-amber mb-2">DIVINE INSPIRATION:</div>
            <div>"Davis proclaimed that he was in direct communication with God, who told him to build a successor to the Second Temple as an operating system."</div>
          </div>
          <div className="border-l-2 border-terminal-cyan pl-4">
            <div className="terminal-amber mb-2">TECHNICAL MASTERY:</div>
            <div>"Starting from nothing, he created his own programming language, a variant of C. As far as I know, no one else has ever created an entire operating system, in complete isolation, before."</div>
          </div>
          <div className="border-l-2 border-terminal-cyan pl-4">
            <div className="terminal-amber mb-2">SELF-PROCLAIMED GENIUS:</div>
            <div>"He would refer to himself as 'the smartest programmer that's ever lived' while showing his creations."</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Community Projects */}
        <div className="terminal-border bg-background p-6">
          <div className="terminal-green text-lg mb-4">COMMUNITY PROJECTS</div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="terminal-cyan">Terry Davis Foundation</div>
              <div className="text-xs terminal-gray">Maintaining archives and legacy</div>
              <div className="text-xs terminal-amber">URL: templeos.net/terry-davis-foundation/</div>
            </div>
            <div>
              <div className="terminal-cyan">TempleOS Forks</div>
              <div className="text-xs terminal-gray">Multiple community continuations</div>
            </div>
            <div>
              <div className="terminal-cyan">Documentation Projects</div>
              <div className="text-xs terminal-gray">Extensive online archives</div>
            </div>
            <div>
              <div className="terminal-cyan">Public Domain Release</div>
              <div className="text-xs terminal-gray">Freely available source code</div>
            </div>
          </div>
        </div>

        {/* Technical Legacy */}
        <div className="terminal-border bg-background p-6">
          <div className="terminal-green text-lg mb-4">TECHNICAL LEGACY</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Lines of Code:</span>
              <span className="terminal-amber">120,000+</span>
            </div>
            <div className="flex justify-between">
              <span>Development Years:</span>
              <span className="terminal-amber">24 Years</span>
            </div>
            <div className="flex justify-between">
              <span>Language Created:</span>
              <span className="terminal-amber">HolyC</span>
            </div>
            <div className="flex justify-between">
              <span>OS Names:</span>
              <span className="terminal-amber">4 Iterations</span>
            </div>
            <div className="flex justify-between">
              <span>Architecture:</span>
              <span className="terminal-amber">64-bit x86</span>
            </div>
            <div className="flex justify-between">
              <span>Graphics Mode:</span>
              <span className="terminal-amber">640x480 VGA</span>
            </div>
            <div className="flex justify-between">
              <span>Color Depth:</span>
              <span className="terminal-amber">16 Colors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memorial Tribute */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">MEMORIAL TRIBUTE</div>
        <div className="text-center space-y-2">
          <div className="terminal-amber text-lg">Terrence Andrew Davis</div>
          <div className="terminal-cyan">December 15, 1969 - August 11, 2018</div>
          <div className="text-sm mt-4">
            "A brilliant engineer whose mental illness both inspired and complicated his singular achievement of creating an entire operating system single-handedly."
          </div>
          <div className="terminal-green text-xs mt-4">
            █ REST IN PEACE, GOD'S LONELY PROGRAMMER █
          </div>
        </div>
      </div>
    </div>
  );
}
