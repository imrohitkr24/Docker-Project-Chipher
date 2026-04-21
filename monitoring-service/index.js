const express = require('express');
const cors = require('cors');
const si = require('systeminformation');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

// Monitoring API
app.get('/monitor/metrics', async (req, res) => {
    try {
        const [cpu, mem, osInfo, load] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.osInfo(),
            si.fullLoad()
        ]);

        res.json({
            cpu: {
                usage: cpu.currentLoad.toFixed(2),
                cores: cpu.cpus.length
            },
            memory: {
                total: (mem.total / 1024 / 1024 / 1024).toFixed(2),
                used: (mem.active / 1024 / 1024 / 1024).toFixed(2),
                free: (mem.available / 1024 / 1024 / 1024).toFixed(2),
                percentage: ((mem.active / mem.total) * 100).toFixed(2)
            },
            system: {
                platform: osInfo.platform,
                distro: osInfo.distro,
                release: osInfo.release,
                uptime: osInfo.uptime
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching system metrics:', error);
        res.status(500).json({ error: 'Failed to retrieve system metrics' });
    }
});

app.listen(port, () => {
    console.log(`Monitoring service listening at http://localhost:${port}`);
});
