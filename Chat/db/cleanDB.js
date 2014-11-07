var mongoose = require('mongoose');

// Connect to mongodb
mongoose.connect('mongodb://localhost/test');

var schema = new mongoose.Schema({user: 'string', color: 'string', message: 'string'});
var Message = mongoose.model('Message', schema);

Message.find({}, function(err, data) {
  console.log(data);

  // Close connection to database
  mongoose.connection.close();
});


