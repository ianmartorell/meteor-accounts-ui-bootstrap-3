(function() {
	if (!Accounts._loginButtons){
		Accounts._loginButtons = {};
	}

	// for convenience
	var loginButtonsSession = Accounts._loginButtonsSession;

	UI.registerHelper("loginButtons", function() {
		return Template._loginButtons;
	});

	// shared between dropdown and single mode
	Template._loginButtons.events({
		'click #login-buttons-logout': function() {
			Meteor.logout(function(error) {
				loginButtonsSession.closeDropdown();
				if (typeof accountsUIBootstrap3.logoutCallback === 'function') {
					accountsUIBootstrap3.logoutCallback(error);
				}
			});
		}
	});

	//
	// loginButtonLoggedOut template
	//
	Template._loginButtonsLoggedOut.helpers({
		dropdown: function() {
			return Accounts._loginButtons.dropdown();
		},
		services: function() {
			return Accounts._loginButtons.getLoginServices();
		},
		singleService: function() {
			var services = Accounts._loginButtons.getLoginServices();
			if (services.length !== 1){
				throw new Error(
					"Shouldn't be rendering this template with more than one configured service");
			}
			return services[0];
		},
		configurationLoaded: function() {
			return Accounts.loginServicesConfigured();
		}
	});



	//
	// loginButtonsLoggedIn template
	//

	// decide whether we should show a dropdown rather than a row of
	// buttons
	Template._loginButtonsLoggedIn.helpers({
		dropdown: function() {
			return Accounts._loginButtons.dropdown();
		},
		displayName: function() {
			return Accounts._loginButtons.displayName();
		}
	})



	//
	// loginButtonsMessage template
	//

	Template._loginButtonsMessages.helpers({
		errorMessage: function() {
			return loginButtonsSession.get('errorMessage');
		},
		infoMessage: function() {
			return loginButtonsSession.get('infoMessage');
		}
	});



	//
	// helpers
	//

	Accounts._loginButtons.displayName = function() {
		var user = Meteor.user();
		if (!user){
			return '';
		}
		if (user.profile && user.profile.firstName){
			return user.profile.firstName;
		}
		if (user.profile && user.profile.name){
			return user.profile.name;
		}
		if (user.username){
			return user.username;
		}
		if (user.emails && user.emails[0] && user.emailAddress()){
			return user.emailAddress();
		}

		return '';
	};

	Accounts._loginButtons.getLoginServices = function() {
		// First look for OAuth services.
		var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

		// Be equally kind to all login services. This also preserves
		// backwards-compatibility. (But maybe order should be
		// configurable?)
		services.sort();

		// Add password, if it's there; it must come last.
		if (this.hasPasswordService()){
			services.push('password');
		}

		return _.map(services, function(name) {
			return {
				name: name
			};
		});
	};

	Accounts._loginButtons.hasPasswordService = function() {
		return !!Package['accounts-password'];
	};

	Accounts._loginButtons.dropdown = function() {
		return this.hasPasswordService() || Accounts._loginButtons.getLoginServices().length > 1;
	};

	// XXX improve these. should this be in accounts-password instead?
	//
	// XXX these will become configurable, and will be validated on
	// the server as well.
	Accounts._loginButtons.validateUsername = function(username) {
		if (username.length >= 3) {
			return true;
		} else {
			loginButtonsSession.errorMessage(i18n('errorMessages.usernameTooShort'));
			return false;
		}
	};
	Accounts._loginButtons.validateEmail = function(email) {
		if (Accounts.ui._passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === ''){
			return true;
		}

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (re.test(email)) {
			return true;
		} else {
			loginButtonsSession.errorMessage(i18n('errorMessages.invalidEmail'));
			return false;
		}
	};
	Accounts._loginButtons.validatePassword = function(password, passwordAgain) {
		if (password.length >= 6) {
			if (passwordAgain && (password != passwordAgain)) {
				loginButtonsSession.errorMessage(i18n('errorMessages.passwordsDontMatch'));
				return false;
			}
			return true;
		} else {
			loginButtonsSession.errorMessage(i18n('errorMessages.passwordTooShort'));
			return false;
		}
	};

	Accounts._loginButtons.rendered = function() {
		debugger;
	};

})();
