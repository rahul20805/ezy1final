import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught crash:", error, info.componentStack);
  }

  handleReload = () => {
    // Clear any bad persisted state that might re-trigger the crash
    try {
      localStorage.removeItem("ezy1-cart");
      localStorage.removeItem("ezy1_auth_token");
      localStorage.removeItem("ezy1_user");
    } catch {}
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #fff7f0 0%, #fff 100%)",
            fontFamily: "'Inter', sans-serif",
            padding: "24px",
            textAlign: "center",
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "linear-gradient(135deg, #FF5100 0%, #FF7A00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 8px 32px rgba(255,81,0,0.25)",
            }}
          >
            <span style={{ fontSize: 32 }}>⚡</span>
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#111",
              marginBottom: 8,
              letterSpacing: "-0.5px",
            }}
          >
            Oops! Something went wrong
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#666",
              maxWidth: 360,
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            Ezy1 hit an unexpected error. Tap the button below to reload the
            app — your session will refresh automatically.
          </p>

          <button
            onClick={this.handleReload}
            style={{
              background: "linear-gradient(135deg, #FF5100 0%, #FF7A00 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(255,81,0,0.3)",
              marginBottom: 16,
            }}
          >
            🔄 Reload Ezy1
          </button>

          {/* Error detail for debugging (collapsed) */}
          {this.state.error && (
            <details
              style={{
                marginTop: 20,
                maxWidth: 500,
                textAlign: "left",
                fontSize: 11,
                color: "#999",
                cursor: "pointer",
              }}
            >
              <summary style={{ cursor: "pointer", marginBottom: 6 }}>
                Show error details
              </summary>
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px 14px",
                  borderRadius: 8,
                  overflowX: "auto",
                  fontSize: 10,
                  color: "#c0392b",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
