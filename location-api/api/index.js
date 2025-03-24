module.exports = async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        return res.json({ message: "Welcome to the Location API!" });
    }

    if (req.method === 'POST') {
        try {
            const body = await new Promise((resolve, reject) => {
                let data = "";
                req.on("data", chunk => { data += chunk; });
                req.on("end", () => resolve(JSON.parse(data)));
                req.on("error", reject);
            });

            const { latitude, longitude, timestamp } = body;

            if (!latitude || !longitude || !timestamp) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            global.locations = global.locations || [];
            global.locations.push({ latitude, longitude, timestamp });

            return res.status(200).json({ success: true, message: 'Location saved' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Invalid JSON format' });
        }
    }

    if (req.method === 'GET') {
        return res.json(global.locations || []);
    }

    res.status(405).json({ success: false, message: 'Method Not Allowed' });
};
