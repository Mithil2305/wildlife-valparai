import React, { Component } from "react";
import { HiExclamationCircle, HiRefresh, HiHome } from "react-icons/hi";

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			eventId: null,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render shows the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log error to console for debugging
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// Store error info for display
		this.setState({
			errorInfo,
			eventId: Date.now().toString(36),
		});

		// Optional: Send error to error reporting service
		// You can integrate with services like Sentry here
		this.logErrorToService(error, errorInfo);
	}

	logErrorToService = (error, errorInfo) => {
		// Placeholder for error reporting integration
		// Example: Sentry, LogRocket, Bugsnag, etc.
		const errorReport = {
			message: error.message,
			stack: error.stack,
			componentStack: errorInfo?.componentStack,
			timestamp: new Date().toISOString(),
			url: window.location.href,
			userAgent: navigator.userAgent,
		};

		console.log("Error Report:", errorReport);

		// In production, you would send this to your error tracking service:
		// Sentry.captureException(error, { extra: errorInfo });
	};

	handleReload = () => {
		window.location.reload();
	};

	handleGoHome = () => {
		window.location.href = "/";
	};

	handleRetry = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
			eventId: null,
		});
	};

	render() {
		const { hasError, error, eventId } = this.state;
		const { children, fallback } = this.props;

		if (hasError) {
			// Custom fallback UI if provided
			if (fallback) {
				return fallback({ error, resetError: this.handleRetry });
			}

			// Default error UI
			return (
				<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
					<div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
						{/* Error Header */}
						<div className="bg-linear-to-r from-red-500 to-red-600 p-6 text-white text-center">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<HiExclamationCircle className="w-10 h-10" />
							</div>
							<h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
							<p className="text-red-100 mt-2 text-sm">
								An unexpected error occurred
							</p>
						</div>

						{/* Error Content */}
						<div className="p-6 space-y-4">
							<div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
								<p className="text-gray-600 text-sm">
									We apologize for the inconvenience. Our team has been notified
									and is working to fix this issue.
								</p>
							</div>

							{/* Error Details (Development only) */}
							{import.meta.env.DEV && error && (
								<div className="bg-red-50 rounded-xl p-4 border border-red-100">
									<p className="text-xs font-mono text-red-700 break-all">
										{error.toString()}
									</p>
								</div>
							)}

							{/* Event ID for support */}
							{eventId && (
								<p className="text-xs text-gray-400 text-center">
									Reference ID: {eventId}
								</p>
							)}

							{/* Action Buttons */}
							<div className="flex flex-col gap-3 pt-2">
								<button
									onClick={this.handleRetry}
									className="w-full flex items-center justify-center gap-2 bg-[#335833] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#2a4a2a] transition-colors"
								>
									<HiRefresh className="w-5 h-5" />
									Try Again
								</button>
								<button
									onClick={this.handleGoHome}
									className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
								>
									<HiHome className="w-5 h-5" />
									Go to Homepage
								</button>
								<button
									onClick={this.handleReload}
									className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors py-2"
								>
									Reload Page
								</button>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return children;
	}
}

/**
 * Higher-order component to wrap any component with error boundary
 * @param {Component} WrappedComponent - Component to wrap
 * @param {Object} options - Configuration options
 * @returns {Component} - Wrapped component with error boundary
 */
export const withErrorBoundary = (WrappedComponent, options = {}) => {
	const { fallback, onError } = options;

	return function WithErrorBoundary(props) {
		return (
			<ErrorBoundary fallback={fallback} onError={onError}>
				<WrappedComponent {...props} />
			</ErrorBoundary>
		);
	};
};

/**
 * Async Error Boundary using Suspense
 * For handling async component loading errors
 */
export const AsyncErrorBoundary = ({ children, fallback }) => {
	return (
		<ErrorBoundary fallback={fallback}>
			<React.Suspense
				fallback={
					<div className="min-h-screen flex items-center justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#335833]"></div>
					</div>
				}
			>
				{children}
			</React.Suspense>
		</ErrorBoundary>
	);
};

export default ErrorBoundary;
