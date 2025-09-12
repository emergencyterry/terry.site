import { useState, useEffect, useCallback } from "react";
import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import ScrollingText from "@/components/scrolling-text";
import MusicPlayer from "@/components/music-player";
import Home from "@/pages/home";
import ForumPage from "@/pages/forum.tsx";
import TheFireRisesPage from "@/pages/the-fire-rises";
import NotFound from "@/pages/not-found";

// Hash routing function for GitHub Pages compatibility
function useHashLocation() {
  const [location, setLocation] = useState(() => {
    return window.location.hash.slice(1) || "/";
  });

  useEffect(() => {
    const handler = () => {
      setLocation(window.location.hash.slice(1) || "/");
    };

    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  return [location, navigate] as [string, (path: string) => void];
}

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/forum" component={ForumPage} />
        <Route path="/the-fire-rises" component={TheFireRisesPage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {/* Site-wide scrolling text */}
          <ScrollingText />
          
          <Toaster />
          <AppRouter />
          
          {/* Site-wide music player */}
          <MusicPlayer />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
