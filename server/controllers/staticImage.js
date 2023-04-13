const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/images/:filename", (req, res) => {
  const options = {
    root: path.join(__dirname, "../public/images"),
  };

  const fileName = req.params.filename;

  res.sendFile(fileName, options, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("Not Found");
    }
  });
});

module.exports = router;
