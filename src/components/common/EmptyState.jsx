import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center
                        justify-center mb-5">
          <Icon size={28} className="text-surface-400" />
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-surface-800 mb-2">
        {title}
      </h3>
      <p className="text-surface-500 text-sm max-w-xs leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <Link to={action.href} className="btn-primary">
          {action.label}
        </Link>
      )}
    </div>
  );
}
