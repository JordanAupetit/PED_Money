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
		clientID    : '959575085832-koj0s3lo8k1jek5bghsrlg8i51h9a8ul.apps.googleusercontent.com',
		clientSecret  : 'YLok67bZpsoelFmPtLVAsrk8',
		callbackURL   : 'http://localhost:8754/auth/google/callback'
	}
}

module.exports = ids