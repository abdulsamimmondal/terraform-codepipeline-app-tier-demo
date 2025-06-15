const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const initDb = require('./initDb');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Root route (optional)
app.get('/', (req, res) => {
    res.send("Welcome to the App Tier backend");
});

// Health check route (used by ALB)
app.get('/health', (req, res) => {
    res.status(200).send("OK");
});

// Add transaction
app.post('/transaction', (req, res) => {
    try {
        const { amount, desc } = req.body;
        const success = transactionService.addTransaction(amount, desc);
        if (success === 200) {
            res.json({ message: 'Added transaction successfully' });
        } else {
            res.status(500).json({ message: 'Transaction failed', status: success });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// Get all transactions
app.get('/transaction', (req, res) => {
    try {
        transactionService.getAllTransactions((results) => {
            const transactionList = results.map(row => ({
                id: row.id,
                amount: row.amount,
                description: row.description
            }));
            res.status(200).json({ result: transactionList });
        });
    } catch (err) {
        res.status(500).json({ message: "Could not get all transactions", error: err.message });
    }
});

// Delete all transactions
app.delete('/transaction', (req, res) => {
    try {
        transactionService.deleteAllTransactions(() => {
            res.status(200).json({ message: "Deleted all transactions." });
        });
    } catch (err) {
        res.status(500).json({ message: "Deleting all transactions failed.", error: err.message });
    }
});

// Delete one transaction
app.delete('/transaction/id', (req, res) => {
    try {
        const id = req.body.id;
        transactionService.deleteTransactionById(id, () => {
            res.status(200).json({ message: `Transaction with id ${id} deleted.` });
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting transaction", error: err.message });
    }
});

// Get single transaction
app.get('/transaction/id', (req, res) => {
    try {
        const id = req.body.id;
        transactionService.findTransactionById(id, (result) => {
            if (result && result.length > 0) {
                const { id, amount, desc } = result[0];
                res.status(200).json({ id, amount, desc });
            } else {
                res.status(404).json({ message: "Transaction not found" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving transaction", error: err.message });
    }
});

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`App listening on http://0.0.0.0:${port}`);
});

// Initialize DB
initDb().catch((err) => {
    console.error("Database initialization failed:", err.message);
});
