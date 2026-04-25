const express = require('express');
const router = express.Router();

// @route   POST /api/translate
// @desc    Translate text (stub for Azure Translator)
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    // Stub: return original text
    res.json({ translatedText: text, targetLanguage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
