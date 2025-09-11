import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function EmulatorSection() {
  const [emulatorStatus, setEmulatorStatus] = useState("READY");
  const [currentCore, setCurrentCore] = useState("None Loaded");
  const [currentRom, setCurrentRom] = useState("No ROM");
  const [selectedSystem, setSelectedSystem] = useState("");
  const [uploadedRom, setUploadedRom] = useState<File | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // System configurations with their cores and supported file extensions
  const systems = [
    { 
      id: 'nes', 
      name: 'Nintendo Entertainment System', 
      core: 'fceumm', 
      extensions: ['.nes'],
      presetGame: { name: 'RasterCat', url: 'https://github.com/dustmop/rastercat/releases/download/v1.0/rastercat.nes' }
    },
    { 
      id: 'gameboy', 
      name: 'Game Boy', 
      core: 'gambatte', 
      extensions: ['.gb', '.gbc'],
      presetGame: { name: 'uCity', url: 'https://github.com/AntonioND/ucity/releases/download/v1.2/ucity.gb' }
    },
    { 
      id: 'snes', 
      name: 'Super Nintendo', 
      core: 'snes9x', 
      extensions: ['.sfc', '.smc'],
      presetGame: { name: 'libSFX Template', url: 'https://github.com/Optiroc/libSFX/releases/download/v1.3.1/Template.sfc' }
    },
    { 
      id: 'ps1', 
      name: 'PlayStation 1', 
      core: 'mednafen_psx_hw', 
      extensions: ['.bin', '.cue', '.img', '.iso', '.pbp'],
      presetGame: null
    },
    { 
      id: 'gamecube', 
      name: 'Nintendo GameCube', 
      core: 'dolphin', 
      extensions: ['.iso', '.gcm', '.gcz'],
      presetGame: null
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const selectedSystemConfig = systems.find(s => s.id === selectedSystem);
    if (!selectedSystemConfig) {
      toast({
        title: 'System not selected',
        description: 'Please select a system first',
        variant: 'destructive',
      });
      return;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!selectedSystemConfig.extensions.includes(fileExtension)) {
      toast({
        title: 'Invalid file type',
        description: `Supported formats for ${selectedSystemConfig.name}: ${selectedSystemConfig.extensions.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setUploadedRom(file);
    toast({
      title: 'ROM file loaded',
      description: `${file.name} ready to play`,
    });
  };

  const loadEmulator = async (core: string, romSource: string | File) => {
    try {
      setEmulatorStatus("LOADING...");
      setCurrentCore(core.toUpperCase());

      let romUrl: string;
      if (typeof romSource === 'string') {
        romUrl = romSource;
        setCurrentRom(romSource.split('/').pop() || "Unknown");
      } else {
        // Create object URL for uploaded file
        romUrl = URL.createObjectURL(romSource);
        setCurrentRom(romSource.name);
      }

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

  const loadPresetGame = () => {
    const systemConfig = systems.find(s => s.id === selectedSystem);
    if (!systemConfig || !systemConfig.presetGame) {
      toast({
        title: 'No preset game available',
        description: 'This system requires a ROM file upload',
        variant: 'destructive',
      });
      return;
    }
    loadEmulator(systemConfig.core, systemConfig.presetGame.url);
  };

  const loadUploadedRom = () => {
    if (!uploadedRom) {
      toast({
        title: 'No ROM file selected',
        description: 'Please select a ROM file first',
        variant: 'destructive',
      });
      return;
    }
    const systemConfig = systems.find(s => s.id === selectedSystem);
    if (!systemConfig) {
      toast({
        title: 'System not selected',
        description: 'Please select a system first',
        variant: 'destructive',
      });
      return;
    }
    loadEmulator(systemConfig.core, uploadedRom);
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
        <div className="terminal-amber text-sm mb-4 p-3 border border-terminal-amber bg-terminal-amber/10">
          ⚠️ ROMS can be found on https://vimm.net/ and https://archive.org . Other sources should be treated with caution!
        </div>
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

      {/* System Selection and ROM Upload */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">SYSTEM SELECTION & ROM LOADING</div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* System Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="system-select" className="terminal-amber mb-2 block">EMULATION SYSTEM:</Label>
              <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                <SelectTrigger 
                  className="bg-background border-terminal-blue text-terminal-green"
                  data-testid="select-system"
                >
                  <SelectValue placeholder="Choose a gaming system..." />
                </SelectTrigger>
                <SelectContent className="bg-background border-terminal-blue">
                  {systems.map((system) => (
                    <SelectItem 
                      key={system.id} 
                      value={system.id}
                      className="text-terminal-green hover:bg-terminal-blue/20"
                    >
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSystem && (
              <div className="text-sm">
                <div className="terminal-cyan mb-2">SYSTEM INFO:</div>
                <div className="space-y-1 text-xs">
                  <div>Core: <span className="terminal-amber">{systems.find(s => s.id === selectedSystem)?.core}</span></div>
                  <div>Supported formats: <span className="terminal-gray">{systems.find(s => s.id === selectedSystem)?.extensions.join(', ')}</span></div>
                  {systems.find(s => s.id === selectedSystem)?.presetGame && (
                    <div>Preset game: <span className="terminal-green">{systems.find(s => s.id === selectedSystem)?.presetGame?.name}</span></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ROM Upload */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="rom-upload" className="terminal-amber mb-2 block">ROM FILE UPLOAD:</Label>
              <Input
                id="rom-upload"
                type="file"
                onChange={handleFileUpload}
                className="bg-background border-terminal-blue text-terminal-green file:bg-terminal-blue file:text-background file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                data-testid="input-rom-upload"
                accept={selectedSystem ? systems.find(s => s.id === selectedSystem)?.extensions.join(',') : '*'}
              />
            </div>

            {uploadedRom && (
              <div className="text-sm">
                <div className="terminal-cyan mb-2">LOADED ROM:</div>
                <div className="text-xs">
                  <div>File: <span className="terminal-green">{uploadedRom.name}</span></div>
                  <div>Size: <span className="terminal-gray">{(uploadedRom.size / 1024 / 1024).toFixed(2)} MB</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Load Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Button
            onClick={loadPresetGame}
            disabled={!selectedSystem || !systems.find(s => s.id === selectedSystem)?.presetGame}
            className="bg-terminal-blue text-background hover:bg-terminal-cyan disabled:opacity-50"
            data-testid="button-load-preset"
          >
            📦 LOAD PRESET GAME
          </Button>
          <Button
            onClick={loadUploadedRom}
            disabled={!uploadedRom || !selectedSystem}
            className="bg-terminal-green text-background hover:bg-terminal-cyan disabled:opacity-50"
            data-testid="button-load-uploaded"
          >
            🎮 LOAD UPLOADED ROM
          </Button>
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