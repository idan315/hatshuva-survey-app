const {config, connectionString} = require('./config');
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "build");
const { MongoClient, ServerApiVersion } = require("mongodb");
const crypto = require("crypto");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use(express.static(publicPath));

app.get("/words", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db(config.db).collection(config.table);

    var word1index = 0,
      word2index = 0;
    while (word1index == word2index) {
      word1index = Math.floor(Math.random() * config.wordList.length);
      word2index = Math.floor(Math.random() * config.wordList.length);
    }

    var word1 = config.wordList[word1index];
    var word2 = config.wordList[word2index];
    var myObj = { word1: word1, word2: word2, uuid: crypto.randomUUID() };

    await collection.insertOne(myObj);

    res.send([word1, word2, myObj.uuid]);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.post("/vote", jsonParser, async (req, res) => {
  try {
    await client.connect();
    const collection = client.db(config.db).collection(config.table);

    var result = await collection.findOne({ uuid: req.body.uuid });
    if (result != null) {
      if (
        result.word1 === req.body.winner ||
        result.word2 === req.body.winner
      ) {
        if (
          result.word1 === req.body.loser ||
          result.word2 === req.body.loser
        ) {
          await collection.findOneAndUpdate(
            { uuid: req.body.uuid },
            {
              $set: {
                winner: req.body.winner,
                loser: req.body.loser,
                item: req.body.item,
              },
            }
          );
        }
      }
    }

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
