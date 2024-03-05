const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// In-memory data structure for demonstration
let claims = {};
let policies = {};

app.use(bodyParser.json());

// Create operation for policy
app.post('/policies', (req, res) => {
    const { id, amount } = req.body;
    policies[id] = amount;
    res.json({ message: "Policy created successfully." });
});

app.get('/policies', (req, res) => {
    res.json(policies);
});

// Create operation for claim
app.post('/claims', (req, res) => {
    const { id, policy_id, amount ,name} = req.body;

    // Check if policy exists
    if (!policies[policy_id]) {
        return res.status(404).json({ message: "Policy does not exist." });
    }

    // Check if claim amount exceeds policy amount
    if (amount > policies[policy_id]) {
        return res.status(400).json({ message: "Claim amount exceeds policy amount." });
    }

    claims[id] = { policy_id, amount , name};
    res.json({ message: "Claim created successfully." });
});

// Read operation for claim
app.get('/claims/:id', (req, res) => {
    const claimId = req.params.id;
    const claim = claims[claimId];
    if (!claim) {
        return res.status(404).json({ message: "Claim not found." });
    }
    res.json(claim);
});

// Update operation for claim
app.put('/claims/:id', (req, res) => {
    const claimId = req.params.id;
    const { amount } = req.body;

    // Check if claim exists
    if (!claims[claimId]) {
        return res.status(404).json({ message: "Claim not found." });
    }

    // Check if new claim amount exceeds policy amount
    if (amount > policies[claims[claimId].policy_id]) {
        return res.status(400).json({ message: "Claim amount exceeds policy amount." });
    }

    claims[claimId].amount = amount;
    res.json({ message: "Claim updated successfully." });
});

// Delete operation for claim
app.delete('/claims/:id', (req, res) => {
    const claimId = req.params.id;
    if (!claims[claimId]) {
        return res.status(404).json({ message: "Claim not found." });
    }
    delete claims[claimId];
    res.json({ message: "Claim deleted successfully." });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
