const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/tg-lookup/:key', async (req, res) => {
    const tgNum = req.query.num || req.query.username;
    if (!tgNum) {
        return res.status(400).json({
            developer: "KaluaApiAdmin",
            status: "error",
            message: "pls contact on telegram id = @KaluaApiAdmin"
        });
    }

    const startTime = Date.now();
    try {
        const upstreamUrl = `https://bronx-ultra-king.duckdns.org/api/custom/tg-new-version?key=tg-free&num=${encodeURIComponent(tgNum)}`;
        
        const response = await fetch(upstreamUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        });

        const textData = await response.text();
        if (textData.trim().startsWith('<!DOCTYPE') || textData.trim().startsWith('<html')) {
            throw new Error("Invalid upstream response");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(textData);
        } catch (e) {
            throw new Error("Failed to parse JSON");
        }

        const responseTime = `${Date.now() - startTime}ms`;
        const rawData = jsonData.data || jsonData;

        return res.json({
            developer: "KaluaApiAdmin",
            country: rawData.country || rawData.country_name || "N/A",
            "country code": rawData.country_code || rawData.countryCode || "N/A",
            number: rawData.number || rawData.phone || rawData.mobile || tgNum,
            "response time": responseTime,
            "tg id": rawData.tg_id || rawData.telegram_id || rawData.id || tgNum
        });

    } catch (error) {
        return res.status(500).json({
            developer: "KaluaApiAdmin",
            status: "error",
            message: "pls contact on telegram id = @KaluaApiAdmin"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Telegram API Hub running on port ${PORT}`);
});
