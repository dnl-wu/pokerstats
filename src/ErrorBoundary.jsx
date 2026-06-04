import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="main-content" style={{ marginTop: 24 }}>
          <div className="loading" style={{ color: '#b91c1c', fontWeight: 700 }}>
            Something broke while rendering: {this.state.error.message}
          </div>
          <p className="loading" style={{ fontStyle: 'normal', marginTop: 12 }}>
            Open the browser developer console (F12 → Console) for the full stack trace.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
