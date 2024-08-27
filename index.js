import express from 'express';
import client from 'prom-client'

const app = express();
const PORT = process.env.PORT || 5000;


const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });


console.log('lol...')

// Function to perform a very heavy computation
const performHeavyTask = () => {
    const arraySize = 1e7; // Array size (e.g., 10 million elements)
    const customArray = Array.from({ length: arraySize }, (_, i) => i + 1); // Fill the array with 1 to arraySize
    let result = 0;

    // Nested loops to exponentially increase the computation time
    customArray.forEach((num) => {
        for (let i = 0; i < arraySize; i++) {
            result += Math.sqrt(num * i);
        }
    });

    return result;
};

// Route that triggers the heavy task
app.get('/heavy-task', (req, res) => {
    try {
        const result = performHeavyTask();
        res.send(`Heavy task completed. Result: ${result}`);
    } catch (error) {
        res.status(500).json({
            "success": false,
            "msg": `Server error: ${error.message}`,
        })
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.get("/metrics", async(req, res) => {
    res.setHeader("Content-Type", register.contentType);
    const metrics = await register.metrics();
    res.send(metrics)
})

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
