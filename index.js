const express = require("express");
const truecallerjs = require("truecallerjs");

const app = express();
const port = 3000;

// Middleware to check API key
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.query.key

  // Check if the provided API key is valid
  if (apiKey === "created-by-nishmal") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized. Invalid API key." });
  }
};

const isValidNumber = (number) => /^\d{10}$/.test(number);
app.get("/", apiKeyMiddleware, async (req, res) => {
  const { number } = req.query;
  const countryCode = "+91";
  const installationId = "a1i0_--jxuw8C-fF6SWKFgG6uQuZtZcIj499BlsKiimjwS96sjABiSktw750DCH0";

  if (!number || !isValidNumber(number)) {
    return res.status(400).json({ error: "Valid 10-digit phone number is required." });
  }

  const searchData = {
    number: `${countryCode}${number}`,
    countryCode,
    installationId,
  };

  try {
    const response = await truecallerjs.search(searchData);
    const result = {
      name: response.getName(),
      alternateName: response.getAlternateName(),
      addresses: response.getAddresses(),
      emailId: response.getEmailId(),
      countryDetails: response.getCountryDetails(),
    };

    res.json(result);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
