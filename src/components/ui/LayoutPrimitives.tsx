import React from "react"

interface PrimitiveProps {
  children?: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = "" }: PrimitiveProps) {
  return (
    <div className={`page-container-primitive ${className}`} style={{
      minHeight: "100vh",
      backgroundColor: "var(--color-surface-muted)",
      color: "var(--color-text-primary)",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      paddingBottom: "80px"
    }}>
      {children}
    </div>
  )
}

export function PageHeader({ children, className = "" }: PrimitiveProps) {
  if (!children) return null
  return (
    <header className={`page-header-primitive ${className}`} style={{
      borderBottom: "1px solid var(--color-border)",
      marginBottom: "var(--space-6)"
    }}>
      {children}
    </header>
  )
}

export function Section({ children, className = "" }: PrimitiveProps) {
  return (
    <section className={`section-primitive ${className}`}>
      {children}
    </section>
  )
}

export function Card({ children, className = "" }: PrimitiveProps) {
  return (
    <div className={`card-primitive ${className}`} style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-6)",
      marginBottom: "var(--space-4)"
    }}>
      {children}
    </div>
  )
}
