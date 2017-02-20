if (!Accounts.ui){
	Accounts.ui = {};
}

if (!Accounts.ui._options) {
	Accounts.ui._options = {
		extraSignupFields: [],
		requestPermissions: {},
		requestOfflineToken: {},
		forceApprovalPrompt: {},
		loginStyle: {},
		forceEmailLowercase: false,
		forceUsernameLowercase: false,
		forcePasswordLowercase: false
	};
}

Accounts.ui.navigate = function (route, hash) {
	// if router is iron-router
	if (window.Router && _.isFunction(Router.go)) {
		Router.go(route, hash);
	}
}

Accounts.ui.config = function(options) {
	// validate options keys
	var VALID_KEYS = ['onCreate', 'passwordSignupFields', 'extraSignupFields', 'forceEmailLowercase', 'forceUsernameLowercase','forcePasswordLowercase',
	'requestPermissions', 'requestOfflineToken', 'forceApprovalPrompt', 'loginStyle'];

	_.each(_.keys(options), function(key) {
		if (!_.contains(VALID_KEYS, key)){
			throw new Error("Accounts.ui.config: Invalid key: " + key);
		}
	});

	if (options.onCreate && typeof options.onCreate === 'function') {
		Accounts.ui._options.onCreate = options.onCreate;
	} else if (! options.onCreate ) {
		//ignore and skip
	} else {
		throw new Error("Accounts.ui.config: Value for 'onCreate' must be a" +
				" function");
	}

	options.extraSignupFields = options.extraSignupFields || [];

	// deal with `passwordSignupFields`
	if (options.passwordSignupFields) {
		if (_.contains([
			"USERNAME_AND_EMAIL_CONFIRM",
			"USERNAME_AND_EMAIL",
			"USERNAME_AND_OPTIONAL_EMAIL",
			"USERNAME_ONLY",
			"EMAIL_ONLY"
		], options.passwordSignupFields)) {
			if (Accounts.ui._options.passwordSignupFields){
				throw new Error("Accounts.ui.config: Can't set `passwordSignupFields` more than once");
			} else {
				Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
			}
		} else {
			throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
		}
	}

	Accounts.ui._options.forceEmailLowercase = options.forceEmailLowercase;
	Accounts.ui._options.forceUsernameLowercase = options.forceUsernameLowercase;
	Accounts.ui._options.forcePasswordLowercase = options.forcePasswordLowercase;
	Accounts.ui._options.loginStyle = options.loginStyle;

	// deal with `requestPermissions`
	if (options.requestPermissions) {
		_.each(options.requestPermissions, function(scope, service) {
			if (Accounts.ui._options.requestPermissions[service]) {
				throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);
			} else if (!(scope instanceof Array)) {
				throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");
			} else {
				Accounts.ui._options.requestPermissions[service] = scope;
			}
		});
	}
	if (typeof options.extraSignupFields !== 'object' || !options.extraSignupFields instanceof Array) {
		throw new Error("Accounts.ui.config: `extraSignupFields` must be an array.");
	} else {
		if (options.extraSignupFields) {
			_.each(options.extraSignupFields, function(field, index) {
				if (!field.fieldName || !field.fieldLabel){
					throw new Error("Accounts.ui.config: `extraSignupFields` objects must have `fieldName` and `fieldLabel` attributes.");
				}
				if (typeof field.visible === 'undefined'){
					field.visible = true;
				}
				Accounts.ui._options.extraSignupFields[index] = field;
			});
		}
	}

	// deal with `requestOfflineToken`
	if (options.requestOfflineToken) {
		_.each(options.requestOfflineToken, function (value, service) {
			if (service !== 'google'){
				throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");
			}
			if (Accounts.ui._options.requestOfflineToken[service]) {
				throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);
			} else {
				Accounts.ui._options.requestOfflineToken[service] = value;
			}
		});
	}

	// deal with `forceApprovalPrompt`
	if (options.forceApprovalPrompt) {
		_.each(options.forceApprovalPrompt, function (value, service) {
			if (service !== 'google'){
				throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");
			}
			if (Accounts.ui._options.forceApprovalPrompt[service]) {
				throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);
			} else {
				Accounts.ui._options.forceApprovalPrompt[service] = value;
			}
		});
	}
};

Accounts.ui._passwordSignupFields = function() {
	return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY";
};
