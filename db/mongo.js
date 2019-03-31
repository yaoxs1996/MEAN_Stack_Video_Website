var mongoose = require('mongoose');
DB_URL = 'mongodb://localhost:27017/website';
mongoose.connect(DB_URL);

mongoose.connection.on('connected', function()
{
    console.log("MongoDB连接到"+ DB_URL);
});

mongoose.connection.on('error', function(error)
{
    console.log(error);
});

var mongooseSchema = new mongoose.Schema({
    u_name: {type: String},
    u_pwd: {type: String}
});

mongooseSchema.methods.findByName = function(name, callback)
{
    return this.model('user').find({u_name: name}, callback);
};

var mongooseModel = mongoose.model('users', mongooseSchema);

module.exports = mongooseModel;

