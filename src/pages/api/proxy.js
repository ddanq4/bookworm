export default async function handler(req, res) {
    const { url } = req.query;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const response = await fetch(decodeURIComponent(url));
        const content = await response.text();
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(content);
    } catch {
        res.status(500).json({ error: 'Fetch failed' });
    }
}
