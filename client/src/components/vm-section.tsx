import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { VmEmulator } from "@/lib/vm-emulator";
import type { VmSession, UploadedFile } from "@shared/schema";

export default function VmSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vmSession, setVmSession] = useState<VmSession | null>(null);
  const [vmStats, setVmStats] = useState({
    cpu: "12%",
    memory: "256MB",
    fps: "60",
    uptime: "00:00:00"
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vmEmulatorRef = useRef<VmEmulator | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: uploadedFiles } = useQuery<UploadedFile[]>({
    queryKey: ["/api/uploaded-files"],
  });

  const { data: vmSessions } = useQuery<VmSession[]>({
    queryKey: ["/api/vm-sessions"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("iso", file);
      const response = await apiRequest("POST", "/api/upload-iso", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/uploaded-files"] });
      toast({ title: "ISO uploaded successfully" });
    },
    onError: () => {
      toast({ title: "Failed to upload ISO", variant: "destructive" });
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: { name: string; isoFileName?: string }) => {
      const response = await apiRequest("POST", "/api/vm-sessions", data);
      return response.json();
    },
    onSuccess: (session: VmSession) => {
      setVmSession(session);
      queryClient.invalidateQueries({ queryKey: ["/api/vm-sessions"] });
      toast({ title: "VM session created" });
    },
  });

  const startVmMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("POST", `/api/vm-sessions/${sessionId}/start`);
      return response.json();
    },
    onSuccess: (session: VmSession) => {
      setVmSession(session);
      if (canvasRef.current && !vmEmulatorRef.current) {
        vmEmulatorRef.current = new VmEmulator(canvasRef.current);
        vmEmulatorRef.current.start();
      }
      toast({ title: "VM started" });
    },
  });

  const stopVmMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("POST", `/api/vm-sessions/${sessionId}/stop`);
      return response.json();
    },
    onSuccess: (session: VmSession) => {
      setVmSession(session);
      if (vmEmulatorRef.current) {
        vmEmulatorRef.current.stop();
        vmEmulatorRef.current = null;
      }
      toast({ title: "VM stopped" });
    },
  });

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const handleStartVm = async () => {
    if (!vmSession) {
      // Create a new session first
      createSessionMutation.mutate({ 
        name: "TempleOS Session", 
        isoFileName: selectedFile?.name 
      });
    } else {
      startVmMutation.mutate(vmSession.id);
    }
  };

  const handleStopVm = async () => {
    if (vmSession) {
      stopVmMutation.mutate(vmSession.id);
    }
  };

  const handleResetVm = async () => {
    if (vmSession) {
      await stopVmMutation.mutateAsync(vmSession.id);
      setTimeout(() => {
        if (vmSession) {
          startVmMutation.mutate(vmSession.id);
        }
      }, 1000);
    }
  };

  const loadPresetIso = (isoName: string) => {
    createSessionMutation.mutate({ 
      name: `${isoName} Session`, 
      isoFileName: isoName 
    });
  };

  // Update VM stats when running
  useEffect(() => {
    if (vmSession?.status === "running") {
      const interval = setInterval(() => {
        setVmStats(prev => ({
          ...prev,
          uptime: new Date(Date.now() - (vmSession.lastStarted ? new Date(vmSession.lastStarted).getTime() : Date.now()))
            .toISOString().substr(11, 8)
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [vmSession]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* VM Controls */}
      <div className="lg:col-span-1">
        <div className="terminal-border bg-background p-4 mb-4">
          <div className="terminal-green mb-4">VM CONTROLS</div>
          
          {/* ISO Upload */}
          <div className="mb-4">
            <Label className="terminal-amber text-sm block mb-2">LOAD ISO FILE:</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".iso"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full bg-background border border-terminal-cyan terminal-gray text-xs p-2 font-mono"
              data-testid="input-iso-file"
            />
            {selectedFile && (
              <Button
                onClick={handleFileUpload}
                disabled={uploadMutation.isPending}
                className="mt-2 w-full bg-terminal-blue text-background p-1 text-xs hover:bg-terminal-cyan"
                data-testid="button-upload-iso"
              >
                {uploadMutation.isPending ? "UPLOADING..." : "UPLOAD ISO"}
              </Button>
            )}
          </div>

          {/* VM Status */}
          <div className="mb-4">
            <div className="terminal-amber text-sm mb-2">STATUS:</div>
            <div className="terminal-green text-xs">
              SYSTEM: <span className={vmSession?.status === "running" ? "animate-blink" : ""}>
                {vmSession?.status?.toUpperCase() || "READY"}
              </span><br />
              MEMORY: <span>{vmSession?.memory || 512}MB</span><br />
              CPU: <span>{vmSession?.cpuCores || 1} CORE</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleStartVm}
              disabled={startVmMutation.isPending || vmSession?.status === "running"}
              className="w-full bg-terminal-green text-background p-2 text-sm hover:bg-terminal-cyan"
              data-testid="button-start-vm"
            >
              ► START VM
            </Button>
            <Button
              onClick={handleStopVm}
              disabled={stopVmMutation.isPending || vmSession?.status !== "running"}
              className="w-full bg-terminal-amber text-background p-2 text-sm hover:bg-terminal-cyan"
              data-testid="button-stop-vm"
            >
              ■ STOP VM
            </Button>
            <Button
              onClick={handleResetVm}
              disabled={!vmSession}
              className="w-full bg-terminal-magenta text-background p-2 text-sm hover:bg-terminal-cyan"
              data-testid="button-reset-vm"
            >
              ↻ RESET VM
            </Button>
          </div>
        </div>

        {/* TempleOS Info */}
        <div className="terminal-border bg-background p-4">
          <div className="terminal-green mb-2">TEMPLEOS SPECS</div>
          <div className="text-xs space-y-1">
            <div>• 64-bit x86-64 Architecture</div>
            <div>• 16-Color VGA Graphics</div>
            <div>• HolyC Programming Language</div>
            <div>• Non-preemptive Multitasking</div>
            <div>• Ring-0 Only Execution</div>
            <div>• Public Domain License</div>
          </div>
        </div>
      </div>

      {/* VM Display */}
      <div className="lg:col-span-2">
        <div className="terminal-border bg-background p-4">
          <div className="terminal-green mb-4">VIRTUAL MACHINE DISPLAY [640x480]</div>
          
          {/* VM Screen */}
          <div className="bg-black border-2 border-terminal-blue aspect-[4/3] relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full"
              data-testid="canvas-vm-display"
            />
            {/* Boot Sequence Display when not running */}
            {vmSession?.status !== "running" && (
              <div className="absolute inset-0 p-4 terminal-green text-xs font-mono">
                <div className="space-y-1">
                  <div>TempleOS V5.03 Boot Loader</div>
                  <div>=====================================</div>
                  <div></div>
                  <div>Detecting Hardware...</div>
                  <div>CPU: x86-64 Compatible</div>
                  <div>Memory: {vmSession?.memory || 512}MB Available</div>
                  <div>Graphics: VGA 640x480 16-Color</div>
                  <div></div>
                  <div>Loading Kernel...</div>
                  <div className="terminal-amber">Loading HolyC Compiler...</div>
                  <div className="terminal-cyan">Initializing God Mode...</div>
                  <div></div>
                  <div className="terminal-green">Ready for Divine Programming.</div>
                  <div></div>
                  <div className="terminal-amber">C:\Home&gt; <span className="animate-blink">_</span></div>
                </div>
              </div>
            )}
          </div>

          {/* VM Stats */}
          <div className="mt-4 grid grid-cols-4 gap-4 text-xs">
            <div className="text-center">
              <div className="terminal-amber">CPU</div>
              <div className="terminal-green" data-testid="text-cpu-usage">{vmStats.cpu}</div>
            </div>
            <div className="text-center">
              <div className="terminal-amber">MEM</div>
              <div className="terminal-green" data-testid="text-memory-usage">{vmStats.memory}</div>
            </div>
            <div className="text-center">
              <div className="terminal-amber">FPS</div>
              <div className="terminal-green" data-testid="text-fps">{vmStats.fps}</div>
            </div>
            <div className="text-center">
              <div className="terminal-amber">UPTIME</div>
              <div className="terminal-green" data-testid="text-uptime">{vmStats.uptime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Available ISOs */}
      <div className="lg:col-span-3">
        <div className="terminal-border bg-background p-4">
          <div className="terminal-green mb-4">AVAILABLE 64-BIT OPERATING SYSTEMS</div>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="border border-terminal-blue p-3">
              <div className="terminal-cyan mb-2">TEMPLEOS V5.03</div>
              <div>Size: 2.3MB</div>
              <div>Lang: HolyC</div>
              <div>Graphics: 16-Color VGA</div>
              <Button
                onClick={() => loadPresetIso("TempleOS V5.03")}
                className="mt-2 terminal-green border border-terminal-green px-2 py-1 hover:bg-terminal-green hover:text-background bg-transparent text-xs"
                data-testid="button-load-templeos"
              >
                LOAD
              </Button>
            </div>
            <div className="border border-terminal-blue p-3">
              <div className="terminal-cyan mb-2">LINUX MINIMAL</div>
              <div>Size: 45MB</div>
              <div>Kernel: 5.15</div>
              <div>Shell: Bash</div>
              <Button
                onClick={() => loadPresetIso("Linux Minimal")}
                className="mt-2 terminal-green border border-terminal-green px-2 py-1 hover:bg-terminal-green hover:text-background bg-transparent text-xs"
                data-testid="button-load-linux"
              >
                LOAD
              </Button>
            </div>
            <div className="border border-terminal-blue p-3">
              <div className="terminal-cyan mb-2">FREEDOS</div>
              <div>Size: 128MB</div>
              <div>Type: DOS Compatible</div>
              <div>Era: Retro Computing</div>
              <Button
                onClick={() => loadPresetIso("FreeDOS")}
                className="mt-2 terminal-green border border-terminal-green px-2 py-1 hover:bg-terminal-green hover:text-background bg-transparent text-xs"
                data-testid="button-load-freedos"
              >
                LOAD
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
