import { Component, type ReactNode } from 'react'

/** Renders `fallback` if a child throws (e.g. WebGL context creation fails). */
export class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[ErrorBoundary]', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
