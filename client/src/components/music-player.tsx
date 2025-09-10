import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Note: The provided Spotify URL cannot be directly embedded as audio
    // Spotify URLs are for the web player/app, not direct audio streams
    // For demonstration, we'll use a placeholder audio file or show a message
    
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set default volume
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-terminal-green p-2 rounded">
      <div className="flex items-center gap-2">
        <div className="text-xs terminal-green">♪ MUSIC</div>
        
        {/* Note: Direct Spotify embedding is not possible with provided URL */}
        <div className="text-xs terminal-amber">
          Spotify integration available
        </div>
        
        <Button
          onClick={toggleMute}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-terminal-green hover:text-terminal-amber"
          data-testid="button-mute-music"
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </Button>
      </div>
      
      {/* Hidden audio element - would need actual audio file URL */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        style={{ display: 'none' }}
      >
        {/* Note: Spotify URLs cannot be used directly as audio sources */}
        {/* Would need actual audio file URL or use Spotify Web API */}
        <source src="" type="audio/mpeg" />
      </audio>
    </div>
  );
}