module.exports = {

    /*'secret': process.env.SECRET,
    'database': process.env.MONGO_DSN,*/
    'secret': prompt.env.SECRET,
    'database': process.env.MONGO_DSN,
    "port" : process.env.PORT || 3000

};
