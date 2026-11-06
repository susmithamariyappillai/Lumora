import {
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';

// Create Toast context
const ToastContext = createContext(null);

// Access toast function from other components
export const useToast = () => useContext(ToastContext);

// Manage popup messages
export function ToastProvider({ children }) {

  // Store popup messages
  const [toasts, setToasts] = useState([]);

  // Display a popup message
  const push = useCallback((message, type = 'success') => {

    // Create a unique ID for each message
    const id = Date.now() + Math.random();

    // Add new message and keep only the latest three
    setToasts((t) => [
      ...t.slice(-2),
      { id, message, type }
    ]);

    // Remove the message after 3.5 seconds
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);

  }, []);

  return (
    <ToastContext.Provider value={{ push }}>

      {children}

      {/* Display popup messages */}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type}`}
          >
            {t.message}
          </div>
        ))}
      </div>

    </ToastContext.Provider>
  );
}