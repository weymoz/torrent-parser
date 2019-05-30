const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/torrents", {useNewUrlParser: true});


before(done => {
  mongoose.connection.once("open", () => {
    console.log("connection ok");
    done();
  });

  mongoose.connection.on("error", console.log.bind(console, "connection error"))
});

beforeEach(done => mongoose.connection.collections.torrents.drop(() => done()));
