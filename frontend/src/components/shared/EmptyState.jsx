const EmptyState = ({ title, description, action }) => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
          <span className="text-text-muted text-2xl">?</span>
        </div>
        <h3 className="font-display font-bold text-text-primary text-lg mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-text-muted text-sm max-w-sm mb-6">{description}</p>
        )}
        {action && action}
      </div>
    );
  };
  
  export default EmptyState;