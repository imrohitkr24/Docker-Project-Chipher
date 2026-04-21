import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, HardDrive, Clock, Users, Database } from 'lucide-react';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [appData, setAppData] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We use relative paths because Nginx will route them correctly
        // Or default to localhost if running outside docker mapped env
        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost' : '';
        
        const [monitorRes, dataRes, statusRes] = await Promise.all([
          fetch(`${baseUrl}/monitor/metrics`).then(res => res.json()),
          fetch(`${baseUrl}/api/data`).then(res => res.json()),
          fetch(`${baseUrl}/api/status`).then(res => res.json())
        ]);

        setMetrics(monitorRes);
        setAppData(dataRes);
        setStatus(statusRes);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container loader">
        <Activity size={48} className="spinner" />
      </div>
    );
  }

  const isHighCpu = metrics?.cpu?.usage > 80;
  const isHighMem = metrics?.memory?.percentage > 85;

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="title">
          <Activity size={36} color="#818cf8" />
          NexusOps Dashboard
        </h1>
        <div className={`status-badge ${error ? 'offline' : ''}`}>
          <div className="status-dot"></div>
          {error ? 'System Offline / Disconnected' : 'All Systems Operational'}
        </div>
      </header>

      {/* Infrastructure Node Metrics */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Infrastructure Metrics</h2>
      <div className="grid">
        {/* CPU USAGE */}
        <div className="glass-card">
          <div className="card-header">
            <span className="card-title"><Cpu size={18} /> CPU Usage</span>
            <span style={{color: isHighCpu ? 'var(--accent-red)' : 'var(--text-muted)'}}>
              {metrics?.cpu?.cores || 0} Cores
            </span>
          </div>
          <div className="card-value">{metrics?.cpu?.usage || 0}%</div>
          <div className="card-subtext">Real-time load average</div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar ${isHighCpu ? 'high' : ''}`} 
              style={{ width: `${metrics?.cpu?.usage || 0}%` }}
            ></div>
          </div>
        </div>

        {/* MEMORY USAGE */}
        <div className="glass-card">
          <div className="card-header">
            <span className="card-title"><HardDrive size={18} /> Memory Allocation</span>
            <span>{metrics?.memory?.percentage || 0}%</span>
          </div>
          <div className="card-value">{metrics?.memory?.used || 0} GB</div>
          <div className="card-subtext">of {metrics?.memory?.total || 0} GB Total</div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar ${isHighMem ? 'high' : ''}`} 
              style={{ width: `${metrics?.memory?.percentage || 0}%` }}
            ></div>
          </div>
        </div>

        {/* SYSTEM INFO */}
        <div className="glass-card">
          <div className="card-header">
            <span className="card-title"><Server size={18} /> Host System</span>
          </div>
          <div className="data-row">
            <span className="card-subtext">OS Platform</span>
            <span>{metrics?.system?.platform}</span>
          </div>
          <div className="data-row">
            <span className="card-subtext">Distribution</span>
            <span>{metrics?.system?.distro}</span>
          </div>
          <div className="data-row">
            <span className="card-subtext">Release</span>
            <span>{metrics?.system?.release}</span>
          </div>
        </div>
      </div>

      {/* Application Metrics */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Application Metrics</h2>
      <div className="grid">
        <div className="glass-card">
          <div className="card-header">
            <span className="card-title"><Users size={18} /> Active Users</span>
          </div>
          <div className="card-value" style={{color: '#818cf8'}}>{appData?.users?.toLocaleString() || 0}</div>
          <div className="card-subtext">Currently connected clients</div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <span className="card-title"><Database size={18} /> Data Processed</span>
          </div>
          <div className="card-value" style={{color: '#10b981'}}>{appData?.requestsProcessed?.toLocaleString() || 0}</div>
          <div className="card-subtext">Total lifecycle queries</div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <span className="card-title"><Clock size={18} /> Uptime</span>
          </div>
          <div className="card-value" style={{color: '#f59e0b'}}>
            {appData?.uptime ? Math.floor(appData.uptime / 3600) : 0}h {appData?.uptime ? Math.floor((appData.uptime % 3600) / 60) : 0}m
          </div>
          <div className="card-subtext">Service running continuously</div>
        </div>
      </div>
    </div>
  );
}

export default App;
