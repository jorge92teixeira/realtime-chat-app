let SERVER_URL = '';

if (process.env.NODE_ENV === 'development') {
  SERVER_URL = 'localhost:5000';
}

if (process.env.NODE_ENV === 'production') {
  SERVER_URL = 'https://jorge92teixeira-chat.herokuapp.com/';
}

module.exports = {
  SERVER_URL,
};
