import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense } from "react"
import { routes } from "./routes"

function RouteLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#0f172a",
      color: "#6366f1",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid #1e293b",
          borderTop: "4px solid #6366f1",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em", color: "#94a3b8" }}>
          LOADING LESSONS...
        </span>
      </div>
    </div>
  )
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {routes.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}