var ids = {
	facebook: {
		clientID: '813575078720997',
		clientSecret: 'f2e2f37aeee852f07a72d19a0440ea41',
		callbackURL: 'http://localhost:8754/auth/facebook/callback'
	},
	twitter: {
		consumerKey: 'get_your_own',
		consumerSecret: 'get_your_own',
		callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
	},
	google: {
		clientID    : '810947933726-ekh9bkh6mvtk2709t1c4j280ql7l1886.apps.googleusercontent.com',
		clientSecret  : 'Q4gdeJIBOG7SPV7wNTPrXzps',
		callbackURL   : 'http://localhost:8754/auth/google/callback'
	}
}

module.exports = ids