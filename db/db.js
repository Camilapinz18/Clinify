const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Successful connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnection;