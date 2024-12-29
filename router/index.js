import app from "../index.js"
app.get('/test', async (req, res) => {
    res.send('test');
});
