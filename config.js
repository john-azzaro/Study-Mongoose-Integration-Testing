//Database
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/restaurants-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-restaurants-app';
//Port
exports.PORT = process.env.PORT || 3000;