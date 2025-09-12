export class VmEmulator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isRunning: boolean = false;
  private animationFrame?: number;
  private bootSequence: string[] = [
    "TempleOS V5.03 Loading...",
    "Initializing Hardware...",
    "Loading HolyC Compiler...",
    "Starting God Mode...",
    "Welcome to TempleOS",
    "C:\\Home>"
  ];
  private currentLine: number = 0;
  private charIndex: number = 0;
  private lastUpdate: number = 0;
  private commandLine: string = "";
  private cursorPosition: number = 0;
  private isBootCompleted: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    this.setupCanvas();
    this.setupKeyboardInput();
  }

  private setupCanvas() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, 640, 480);
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '12px "Courier New", monospace';
    this.ctx.textBaseline = 'top';
    
    // Make canvas focusable and set focus
    this.canvas.tabIndex = 0;
    this.canvas.style.outline = 'none';
  }

  private setupKeyboardInput() {
    this.canvas.addEventListener('keydown', (e) => {
      if (!this.isRunning || !this.isBootCompleted) return;
      
      e.preventDefault();
      
      switch (e.key) {
        case 'Enter':
          this.handleCommand();
          break;
        case 'Backspace':
          if (this.commandLine.length > 0) {
            this.commandLine = this.commandLine.slice(0, -1);
          }
          break;
        default:
          if (e.key.length === 1 && this.commandLine.length < 60) {
            this.commandLine += e.key;
          }
          break;
      }
    });

    // Focus canvas when clicked
    this.canvas.addEventListener('click', () => {
      this.canvas.focus();
    });
  }

  private handleCommand() {
    // Simple command handling
    const cmd = this.commandLine.trim().toLowerCase();
    this.commandLine = "";
    
    // Add command to display (simulate command execution)
    // For now, just echo back the command
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentLine = 0;
    this.charIndex = 0;
    this.lastUpdate = Date.now();
    this.setupCanvas();
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.setupCanvas();
  }

  private animate = () => {
    if (!this.isRunning) return;

    const now = Date.now();
    if (now - this.lastUpdate > 100) { // Update every 100ms
      this.updateDisplay();
      this.lastUpdate = now;
    }

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private updateDisplay() {
    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, 640, 480);
    
    // Draw boot sequence
    this.ctx.fillStyle = '#00FF00';
    
    for (let i = 0; i <= this.currentLine && i < this.bootSequence.length; i++) {
      const line = this.bootSequence[i];
      const y = 20 + (i * 20);
      
      if (i === this.currentLine) {
        // Type out current line character by character
        const displayText = line.substring(0, this.charIndex);
        this.ctx.fillText(displayText, 20, y);
        
        // Blinking cursor
        if (Math.floor(Date.now() / 500) % 2 === 0) {
          this.ctx.fillText('_', 20 + (this.charIndex * 7), y);
        }
        
        this.charIndex++;
        if (this.charIndex > line.length + 10) { // Pause before next line
          this.currentLine++;
          this.charIndex = 0;
        }
      } else {
        // Display complete line
        this.ctx.fillText(line, 20, y);
      }
    }

    // Once boot sequence is complete, show running system
    if (this.currentLine >= this.bootSequence.length) {
      this.isBootCompleted = true;
      this.drawRunningSystem();
    }
  }

  private drawRunningSystem() {
    // Clear and draw a simple desktop-like interface
    this.ctx.fillStyle = '#0000AA'; // Blue background
    this.ctx.fillRect(0, 0, 640, 480);
    
    // Title bar
    this.ctx.fillStyle = '#00FFFF';
    this.ctx.fillRect(0, 0, 640, 20);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText('TempleOS - God\'s Operating System', 10, 5);
    
    // Desktop content
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.fillText('Welcome to TempleOS!', 50, 50);
    this.ctx.fillText('Created by Terry A. Davis', 50, 80);
    this.ctx.fillText('HolyC Compiler Ready', 50, 110);
    this.ctx.fillText('640x480 VGA 16-Color Mode', 50, 140);
    this.ctx.fillText('Type commands and press Enter', 50, 170);
    
    // Command line
    const prompt = 'C:\\Home> ';
    this.ctx.fillStyle = '#00FF00';
    this.ctx.fillText(prompt + this.commandLine, 50, 200);
    
    // Blinking cursor
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      this.ctx.fillStyle = '#FFFFFF';
      const cursorX = 50 + (prompt.length + this.commandLine.length) * 7;
      this.ctx.fillText('█', cursorX, 200);
    }
  }
}
