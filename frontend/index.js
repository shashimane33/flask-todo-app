var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const URL = "http://localhost:5000"

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));


app.get('/', async function (req, res) {
    try {
        const response = await fetch(URL + "/task");
        if (!response.ok) throw new Error('Failed to fetch tasks: ' + response.status);
        const tasks = await response.json();
        const msg = req.query.added === '1' ? 'Task added successfully!' : (req.query.error ? 'Failed to add task' : null);
        res.render('index', { data: tasks, msg });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addtask', async function (req, res) {
    try {
        const payload = {
            task: req.body.task,
            desc: req.body.desc
        };

        const backendResp = await fetch(URL + "/addtask", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!backendResp.ok) {
            const errBody = await backendResp.text();
            console.error('Backend error:', backendResp.status, errBody);
            return res.redirect('/?error=1');
        }

        return res.redirect('/');
    } catch (err) {
        console.error('Proxy error:', err);
        return res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, function () {
    console.log("todo app is running on port 3000");
})