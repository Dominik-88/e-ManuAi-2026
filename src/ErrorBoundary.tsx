// src/ErrorBoundary.tsx
import React from ‘react’;

interface Props {
children: React.ReactNode;
}

interface State {
hasError: boolean;
error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
constructor(props: Props) {
super(props);
this.state = { hasError: false, error: null };
}

static getDerivedStateFromError(error: Error): State {
return { hasError: true, error };
}

componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
console.error(‘❌ App crashed:’, error, errorInfo);
}

render() {
if (this.state.hasError) {
return (
<div style={{
display: ‘flex’,
flexDirection: ‘column’,
alignItems: ‘center’,
justifyContent: ‘center’,
minHeight: ‘100vh’,
padding: ‘2rem’,
backgroundColor: ‘#0f172a’,
color: ‘#fff’,
fontFamily: ‘system-ui, sans-serif’
}}>
<div style={{
maxWidth: ‘600px’,
textAlign: ‘center’
}}>
<h1 style={{ fontSize: ‘2rem’, marginBottom: ‘1rem’ }}>
⚠️ Chyba při načítání aplikace
</h1>

```
        <div style={{
          backgroundColor: '#1e293b',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Chybová zpráva:
          </p>
          <code style={{
            display: 'block',
            padding: '1rem',
            backgroundColor: '#0f172a',
            borderRadius: '4px',
            fontSize: '0.875rem',
            overflowX: 'auto'
          }}>
            {this.state.error?.message || 'Neznámá chyba'}
          </code>
        </div>

        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Možné příčiny:
          </p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Chybějící environment variables (VITE_SUPABASE_URL)</li>
            <li>Špatná base path konfigurace</li>
            <li>CORS chyba při připojení k Supabase</li>
            <li>Import error v kódu</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🔄 Zkusit znovu
        </button>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#1e293b',
          borderRadius: '6px',
          fontSize: '0.875rem'
        }}>
          <p>
            <strong>Pro opravení:</strong> Zkontroluj GitHub Actions build log 
            nebo otevři browser console (F12) pro detailní chybovou zprávu.
          </p>
        </div>
      </div>
    </div>
  );
}

return this.props.children;
```

}
}
