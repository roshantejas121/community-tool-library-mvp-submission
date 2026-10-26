import React, { useCallback, useEffect, useState } from 'react';
import ToolList from './components/ToolList';
import AddToolForm from './components/AddToolForm';
import { getTools } from './services/api';
import './App.css';

function App() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchTools = useCallback(async () => {
    try {
      setLoadError('');
      setLoading(true);
      setTools(await getTools());
    } catch (error) {
      console.error('Error fetching tools:', error);
      setLoadError(error.message || 'Unable to load tools.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const handleToolAdded = (newTool) => {
    setTools((currentTools) => [...currentTools, newTool]);
  };

  const handleToolUpdate = (updatedTool) => {
    setTools((currentTools) => currentTools.map((tool) => (
      tool.id === updatedTool.id ? updatedTool : tool
    )));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="icon">🛠️</span>
          <h1>Community Tool Library</h1>
        </div>
        <p className="subtitle">Borrow what you need. Share what you own.</p>
      </header>
      <main className="app-content">
        <section>
          <AddToolForm onToolAdded={handleToolAdded} />
        </section>
        <section>
          {loading && <div className="loader">Loading tools...</div>}
          {!loading && loadError && (
            <div className="borrow-error" role="alert">
              {loadError} <button type="button" onClick={fetchTools}>Retry</button>
            </div>
          )}
          {!loading && !loadError && (
            <ToolList tools={tools} onUpdateTool={handleToolUpdate} />
          )}
        </section>
      </main>
      <footer className="app-footer">
        <p>© 2026 Community Tool Library</p>
      </footer>
    </div>
  );
}

export default App;
