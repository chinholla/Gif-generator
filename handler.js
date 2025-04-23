const axios = require('axios');

exports.handler = async (event) => {
    const prompt = event.pathParameters?.prompt;
    if (!prompt) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Prompt is required' })
        };
    }

    try {
        const giphyApiKey = process.env.GIPHY_API_KEY;
        const giphyResp = await axios.get('https://api.giphy.com/v1/gifs/translate', {
            params: { api_key: giphyApiKey, s: prompt, weirdness: 4 }
        });

        const gifUrl = giphyResp?.data?.data?.images?.original?.url;
        if (!gifUrl) throw new Error('GIF not found');

        const html = `
        <!DOCTYPE html>
        <html>
        <head><title>GIF Result</title></head>
        <body style="text-align:center; margin-top:50px;">
            <img src="${gifUrl}" alt="GIF result" />
        </body>
        </html>
        `;
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: html
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to fetch GIF', details: err.message })
        };
    }
};
