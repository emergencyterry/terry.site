export default function TheFireRisesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-red-500 mb-4">THE FIRE RISES</div>
          <div className="text-sm text-gray-400">No one cared who I was until I put on the mask</div>
        </div>

        {/* YouTube Embed */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full border-2 border-red-500"
                src="https://www.youtube.com/embed/3A2ZwzP9Yw4"
                title="THE FIRE RISES"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                data-testid="youtube-embed"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.hash = '/'}
            className="bg-red-500 text-white px-6 py-2 hover:bg-red-600 transition-colors duration-200"
            data-testid="button-home"
          >
            RETURN
          </button>
        </div>
      </div>
    </div>
  );
}