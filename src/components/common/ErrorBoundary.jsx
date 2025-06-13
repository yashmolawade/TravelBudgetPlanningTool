import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">
              Oops! Something went wrong.
            </h2>
            <p className="text-sm mb-4">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="text-xs text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
                <summary>Error Details</summary>
                <pre className="whitespace-pre-wrap break-words text-left mt-2">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
