const PageLoader = () => {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm font-body">Loading...</p>
        </div>
      </div>
    );
  };
  
  export default PageLoader;