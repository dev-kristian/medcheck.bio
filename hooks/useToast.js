import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export function useCustomToast() {
  const [activeToasts, setActiveToasts] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToasts((prev) => {
        const now = Date.now();
        const newToasts = { ...prev };
        Object.keys(newToasts).forEach((key) => {
          if (newToasts[key].expires <= now) {
            delete newToasts[key];
          }
        });
        return newToasts;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (title, description, type = 'default') => {
    const toastId = `${type}-${title}-${description}`;

    if (activeToasts[toastId]) {
      return;
    }

    const icons = {
      success: <CheckCircle className="w-5 h-5 text-white" />,
      error: <XCircle className="w-5 h-5 text-white" />,
      warning: <AlertCircle className="w-5 h-5 text-white" />,
      info: <Info className="w-5 h-5 text-white" />,
      default: <Info className="w-5 h-5 text-white" />,
    };

    const bgColors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
      default: 'bg-gray-600',
    };

    const toastInstance = toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full ${bgColors[type]} text-white rounded-lg shadow-lg pointer-events-auto flex p-3 sm:p-4`}
        >
          <div className="flex items-center w-full">
            <div className="flex-shrink-0 self-center pt-1 sm:pt-0 pr-3">
              {icons[type]}
            </div>
            <div className="flex-1 w-0">
              <p className="text-sm font-medium leading-5 sm:leading-6">
                {title}
              </p>
              {description && (
                <p className="mt-1 text-xs sm:text-sm leading-4 sm:leading-5 opacity-90">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      ),
      {
        duration: 3000,
        position: 'bottom-center',
        onClose: () => {
          setActiveToasts((prev) => {
            const newToasts = { ...prev };
            delete newToasts[toastId];
            return newToasts;
          });
        },
      }
    );

    setActiveToasts((prev) => ({
      ...prev,
      [toastId]: { instance: toastInstance, expires: Date.now() + 3000 },
    }));
  };

  return { showToast };
}
