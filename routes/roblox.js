const axios = require('axios');

module.exports = (app) => {
    app.get('/api/roblox/:roblox', async (req, res) => {
        const { roblox } = req.params;
        try {
            const response = await axios.get(`https://tilki.dev/api/roblox-kullanici-bilgi?ad=${roblox}`);

            const responseData = response.data;
            const cleanData = {
                lakab: responseData.gorunen_ad,
                banlimi: responseData.banlimi,
                id: responseData.id,
                roblox_ana_ad: responseData.ad,
                fotograf_karakter: responseData.karakter,
                profil: responseData.profil_link,
            };

            const formattedJSON = JSON.stringify(cleanData, null, 2); // 2 boşluklu güzel bir format
            res.setHeader('Content-Type', 'application/json');
            res.send(formattedJSON);
        } catch (error) {
            console.error('Hata:', error.message);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    });
};
