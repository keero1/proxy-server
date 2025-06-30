import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(json());

app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;

    if (!imageUrl || typeof imageUrl !== 'string') {
        return res.status(400).send('Missing or invalid url parameter');
    }

    try {
        const response = await axios.get(imageUrl, {
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('Access-Control-Allow-Origin', '*');

        response.data.pipe(res);
    } catch (err) {
        console.error(`Image proxy failed for ${imageUrl}`, err.message);
        res.status(500).send('Failed to fetch image');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at ${PORT}`);
});
