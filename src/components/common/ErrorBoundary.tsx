import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught application error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-950 p-6 text-center text-white">
          <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-950 text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h1 className="text-xl font-bold text-white">Something went wrong</h1>

            <p className="text-sm text-gray-400">
              The application encountered an unexpected error. Please restart the app.
            </p>

            {this.state.error?.message && (
              <pre className="max-h-24 w-full overflow-hidden text-ellipsis rounded bg-gray-950 p-2 text-xs text-gray-500">
                {this.state.error.message}
              </pre>
            )}

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
