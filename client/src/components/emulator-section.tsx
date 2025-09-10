import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function EmulatorSection() {
  const [emulatorStatus, setEmulatorStatus] = useState("READY");
  const [currentCore, setCurrentCore] = useState("None Loaded");
  const [currentRom, setCurrentRom] = useState("No ROM");
  const gameRef = useRef<HTMLDivElement>(null);

  const loadEmulator = async (core: string, romUrl: string) => {
    try {
      setEmulatorStatus("LOADING...");
      setCurrentCore(core.toUpperCase());
      setCurrentRom(romUrl.split('/').pop() || "Unknown");

      // Configure EmulatorJS
      (window as any).EJS_player = "#game";
      (window as any).EJS_core = core;
      (window as any).EJS_gameUrl = romUrl;
      (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
      (window as any).EJS_startOnLoaded = true;
      (window as any).EJS_gameID = Math.random().toString(36).substr(2, 9);

      // Load EmulatorJS script
      const script = document.createElement('script');
      script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
      script.onload = () => {
        setEmulatorStatus("RUNNING");
        if (gameRef.current) {
          gameRef.current.style.display = 'block';
        }
      };
      script.onerror = () => {
        setEmulatorStatus("ERROR");
      };
      
      // Remove existing scripts
      const existingScripts = document.querySelectorAll('script[src*="loader.js"]');
      existingScripts.forEach(s => s.remove());
      
      document.head.appendChild(script);

    } catch (error) {
      console.error('Emulator loading error:', error);
      setEmulatorStatus("ERROR");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gameRef.current?.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  const resetEmulator = () => {
    if ((window as any).EJS_emulator?.restart) {
      (window as any).EJS_emulator.restart();
    }
  };

  const saveState = () => {
    if ((window as any).EJS_emulator?.saveState) {
      (window as any).EJS_emulator.saveState();
    }
  };

  const loadState = () => {
    if ((window as any).EJS_emulator?.loadState) {
      (window as any).EJS_emulator.loadState();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">RETROARCH EMULATION SYSTEM</div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="terminal-amber mb-2">TRIBUTE TO RETRO COMPUTING:</div>
            <div className="text-sm">
              Terry A. Davis was inspired by classic computing systems and believed in the power of simple, efficient code. This emulation section honors that philosophy by preserving classic computing experiences that influenced his work on TempleOS.
            </div>
          </div>
          <div>
            <div className="terminal-amber mb-2">EMULATION SPECS:</div>
            <div className="text-sm space-y-1">
              <div>• RetroArch Web Frontend</div>
              <div>• Multiple Console Support</div>
              <div>• Browser-based WebAssembly</div>
              <div>• Save State Functionality</div>
              <div>• Homebrew Games</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selection */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">CLASSIC GAME LIBRARY</div>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="border border-terminal-blue p-4">
            <div className="terminal-cyan mb-2">NES HOMEBREW</div>
            <div>8-bit computing era</div>
            <div>Simple graphics, pure logic</div>
            <div>Foundation of gaming</div>
            <Button
              onClick={() => loadEmulator('nes', 'https://github.com/dustmop/rastercat/releases/download/v1.0/rastercat.nes')}
              className="mt-2 w-full bg-terminal-green text-background hover:bg-terminal-cyan text-xs p-2"
              data-testid="button-load-nes"
            >
              LOAD NES
            </Button>
          </div>
          <div className="border border-terminal-blue p-4">
            <div className="terminal-cyan mb-2">GAMEBOY DEMO</div>
            <div>Portable computing</div>
            <div>Monochrome elegance</div>
            <div>Efficient architecture</div>
            <Button
              onClick={() => loadEmulator('gambatte', 'https://github.com/AntonioND/ucity/releases/download/v1.2/ucity.gb')}
              className="mt-2 w-full bg-terminal-green text-background hover:bg-terminal-cyan text-xs p-2"
              data-testid="button-load-gameboy"
            >
              LOAD GB
            </Button>
          </div>
          <div className="border border-terminal-blue p-4">
            <div className="terminal-cyan mb-2">SNES DEMO</div>
            <div>16-bit power</div>
            <div>Enhanced graphics</div>
            <div>Mode 7 scaling</div>
            <Button
              onClick={() => loadEmulator('snes9x', 'https://github.com/Optiroc/libSFX/releases/download/v1.3.1/Template.sfc')}
              className="mt-2 w-full bg-terminal-green text-background hover:bg-terminal-cyan text-xs p-2"
              data-testid="button-load-snes"
            >
              LOAD SNES
            </Button>
          </div>
        </div>
      </div>

      {/* Emulator Display */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1">
          <div className="terminal-border bg-background p-4 mb-4">
            <div className="terminal-green mb-4">EMULATOR STATUS</div>
            <div className="text-sm space-y-1 mb-4">
              <div>STATUS: <span className={emulatorStatus === "RUNNING" ? "animate-blink terminal-green" : "terminal-amber"}>{emulatorStatus}</span></div>
              <div>CORE: <span className="terminal-cyan">{currentCore}</span></div>
              <div>ROM: <span className="terminal-gray">{currentRom}</span></div>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={toggleFullscreen}
                className="w-full bg-terminal-blue text-background hover:bg-terminal-cyan text-sm p-2"
                data-testid="button-fullscreen"
              >
                ⛶ FULLSCREEN
              </Button>
              <Button
                onClick={resetEmulator}
                className="w-full bg-terminal-magenta text-background hover:bg-terminal-cyan text-sm p-2"
                data-testid="button-reset-emulator"
              >
                ↻ RESET
              </Button>
              <Button
                onClick={saveState}
                className="w-full bg-terminal-amber text-background hover:bg-terminal-cyan text-sm p-2"
                data-testid="button-save-state"
              >
                💾 SAVE STATE
              </Button>
              <Button
                onClick={loadState}
                className="w-full bg-terminal-green text-background hover:bg-terminal-cyan text-sm p-2"
                data-testid="button-load-state"
              >
                📁 LOAD STATE
              </Button>
            </div>
          </div>

          {/* Terry Davis Quote */}
          <div className="terminal-border bg-background p-4">
            <div className="terminal-green mb-2">TERRY'S WISDOM</div>
            <div className="text-xs terminal-amber">
              "The computer industry is full of lies. People say you need advanced graphics and complex systems. But look at these old games - they're perfect with just a few colors and simple logic."
            </div>
            <div className="text-xs terminal-gray mt-2">
              - Philosophy applied to retro gaming
            </div>
          </div>
        </div>

        {/* Emulator Screen */}
        <div className="lg:col-span-2">
          <div className="terminal-border bg-background p-4">
            <div className="terminal-green mb-4">GAME DISPLAY</div>
            
            <div className="bg-black border-2 border-terminal-blue aspect-[4/3] relative overflow-hidden" style={{ minHeight: '400px' }}>
              <div 
                ref={gameRef}
                id="game" 
                className="w-full h-full"
                style={{ display: emulatorStatus === "RUNNING" ? 'block' : 'none' }}
                data-testid="emulator-display"
              />
              {emulatorStatus !== "RUNNING" && (
                <div className="absolute inset-0 flex items-center justify-center p-4 terminal-green text-center">
                  <div>
                    <div className="text-lg mb-4">RETROARCH EMULATION SYSTEM</div>
                    <div className="text-sm">Select a system above to load a game</div>
                    <div className="text-sm terminal-amber mt-2">Ready for Divine Gaming</div>
                    {emulatorStatus === "ERROR" && (
                      <div className="text-sm terminal-red mt-2">Failed to load emulator</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Controls Info */}
            <div className="mt-4 text-xs terminal-gray">
              <div className="terminal-amber mb-2">CONTROLS:</div>
              <div>WASD or Arrow Keys: D-Pad | Z,X: A,B Buttons | Enter: Start | Shift: Select</div>
              <div>F11: Fullscreen | F1: Menu | F2: Save State | F4: Load State</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gaming Philosophy */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">TERRY'S GAMING PHILOSOPHY</div>
        <div className="space-y-4 text-sm">
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber mb-2">SIMPLICITY OVER COMPLEXITY:</div>
            <div>"Modern games are bloated with unnecessary features. The best games, like the best code, do one thing perfectly. Look at Tetris - pure mathematical beauty."</div>
          </div>
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber mb-2">EFFICIENCY IN DESIGN:</div>
            <div>"These old consoles had severe limitations - tiny memory, slow processors. Yet they created experiences that are still enjoyed today. Constraints breed creativity."</div>
          </div>
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber mb-2">DIRECT HARDWARE ACCESS:</div>
            <div>"No layers of abstraction, no framework overhead. The programmer talks directly to the hardware. That's how TempleOS works, and how these classic games work."</div>
          </div>
        </div>
      </div>
    </div>
  );
}