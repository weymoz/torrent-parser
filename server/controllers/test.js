const mongoose = require("mongoose");

const Schema = mongoose.Schema;
module.exports = (req, res) => {

  const personSchema = Schema({
      _id: Schema.Types.ObjectId,
      name: String,
      age: Number,
      stories: [{ type: Schema.Types.ObjectId, ref: 'Story'  }]

  });

  const storySchema = Schema({
      author: { type: Schema.Types.ObjectId, ref: 'Person'  },
      title: String,
      fans: [{ type: Schema.Types.ObjectId, ref: 'Person'  }]

  });

  const Story = mongoose.model('Story', storySchema);
  const Person = mongoose.model('Person', personSchema);


  const author = new Person({
    _id: new mongoose.Types.ObjectId(),
    name: 'Ian Fleming',
    age: 50
  });


  author.save(function(err) {
    if(err) return console.log(err);

    const story1 = new Story({
      title: 'Casino Royale',
      author: author._id
    });

    story1.save(function(err) {
      if(err) return console.log(err);

      Story.find({}).populate('author').exec(function(err, result) {
        if(err) return console.log(err);

        console.log(result);
      })
    })
  })

  res.end('test');
}

