(function() {
	// for convenience
	var loginButtonsSession = Accounts._loginButtonsSession;


	//
	// populate the session so that the appropriate dialogs are
	// displayed by reading variables set by accounts-urls, which parses
	// special URLs. since accounts-ui depends on accounts-urls, we are
	// guaranteed to have these set at this point.
	//

	if (Accounts._resetPasswordToken) {
		loginButtonsSession.set('resetPasswordToken', Accounts._resetPasswordToken);
	}

	if (Accounts._enrollAccountToken) {
		loginButtonsSession.set('enrollAccountToken', Accounts._enrollAccountToken);
	}

	// Needs to be in Meteor.startup because of a package loading order
	// issue. We can't be sure that accounts-password is loaded earlier
	// than accounts-ui so Accounts.verifyEmail might not be defined.
	Meteor.startup(function() {
		if (Accounts._verifyEmailToken) {
			Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {
				Accounts._enableAutoLogin();
				if (!error){
					loginButtonsSession.set('justVerifiedEmail', true);
				}
				// XXX show something if there was an error.
			});
		}
	});

	//
	// resetPasswordDialog template
	//

	Template._resetPasswordDialog.events({
		'click #login-buttons-reset-password-button': function(event) {
			event.stopPropagation();
			resetPassword();
		},
		'keypress #reset-password-new-password': function(event) {
			if (event.keyCode === 13){
				resetPassword();
			}
		},
		'click #login-buttons-cancel-reset-password': function(event) {
			event.stopPropagation();
			loginButtonsSession.set('resetPasswordToken', null);
			Accounts._enableAutoLogin();
			$('#login-buttons-reset-password-modal').modal("hide");
		},
		'click #login-buttons-dismiss-reset-password-success': function(event) {
			event.stopPropagation();
			$('#login-buttons-reset-password-modal-success').modal("hide");
		}
	});

	var resetPassword = function() {
		loginButtonsSession.resetMessages();
		var newPassword = Template.instance().find('#reset-password-new-password').value;
		var passwordAgain= Template.instance().find('#reset-password-new-password-again').value;
		if (!Accounts._loginButtons.validatePassword(newPassword,passwordAgain)){
			return;
		}

		Accounts.resetPassword(
			loginButtonsSession.get('resetPasswordToken'), newPassword,
			function(error) {
				if (error) {
					loginButtonsSession.errorMessage(error.reason || "Unknown error");
				} else {
					$('#login-buttons-reset-password-modal').modal("hide");
					$('#login-buttons-reset-password-modal-success').modal();
					loginButtonsSession.infoMessage(i18n('infoMessages.passwordChanged'));
					loginButtonsSession.set('resetPasswordToken', null);
					Accounts._enableAutoLogin();
				}
			});
	};

	Template._resetPasswordDialog.helpers({
		inResetPasswordFlow: function() {
			return loginButtonsSession.get('resetPasswordToken');
		}
	});

	Template._resetPasswordDialog.onRendered(function() {
		var $modal = $(this.find('#login-buttons-reset-password-modal'));
		if (!_.isFunction($modal.modal)) {
			console.error("You have to add a Bootstrap package, i.e. meteor add twbs:bootstrap");
		} else {
			$modal.modal();
		}
	});

	//
	// enrollAccountDialog template
	//

	Template._enrollAccountDialog.events({
		'click #login-buttons-enroll-account-button': function() {
			enrollAccount();
		},
		'keypress #enroll-account-password': function(event) {
			if (event.keyCode === 13){
				enrollAccount();
			}
		},
		'click #login-buttons-cancel-enroll-account-button': function() {
			loginButtonsSession.set('enrollAccountToken', null);
			Accounts._enableAutoLogin();
			$modal.modal("hide");
		}
	});

	var enrollAccount = function() {
		loginButtonsSession.resetMessages();
		var password = Template.instance().find('#enroll-account-password').value;
		var passwordAgain= Template.instance().find('#enroll-account-password-again').value;
		if (!Accounts._loginButtons.validatePassword(password,passwordAgain)){
			return;
		}

		Accounts.resetPassword(
			loginButtonsSession.get('enrollAccountToken'), password,
			function(error) {
				if (error) {
					loginButtonsSession.errorMessage(error.reason || "Unknown error");
				} else {
					loginButtonsSession.set('enrollAccountToken', null);
					Accounts._enableAutoLogin();
					$modal.modal("hide");
				}
			});
	};

	Template._enrollAccountDialog.helpers({
		inEnrollAccountFlow: function() {
			return loginButtonsSession.get('enrollAccountToken');
		}
	});

	Template._enrollAccountDialog.onRendered(function() {
		$modal = $(this.find('#login-buttons-enroll-account-modal'));
		if (!_.isFunction($modal.modal)) {
			console.error("You have to add a Bootstrap package, i.e. meteor add twbs:bootstrap");
		} else {
			$modal.modal();
		}
	});

	//
	// justVerifiedEmailDialog template
	//

	Template._justVerifiedEmailDialog.events({
		'click #just-verified-dismiss-button': function() {
			loginButtonsSession.set('justVerifiedEmail', false);
		}
	});

	Template._justVerifiedEmailDialog.helpers({
		visible: function() {
			if (loginButtonsSession.get('justVerifiedEmail')) {
				setTimeout(function() {
					$('#login-buttons-email-address-verified-modal').modal()
				}, 500)
			}
			return loginButtonsSession.get('justVerifiedEmail');
		}
	});


	//
	// loginButtonsMessagesDialog template
	//

	var messagesDialogVisible = function() {
		var hasMessage = loginButtonsSession.get('infoMessage') || loginButtonsSession.get('errorMessage');
		return !Accounts._loginButtons.dropdown() && hasMessage;
	}


	Template._loginButtonsMessagesDialog.onRendered(function() {
		var self = this;

		self.autorun(function() {
			if (messagesDialogVisible()) {
				var $modal = $(self.find('#login-buttons-message-dialog'));
				if (!_.isFunction($modal.modal)) {
					console.error("You have to add a Bootstrap package, i.e. meteor add twbs:bootstrap");
				} else {
					$modal.modal();
				}
			}
		});
	});

	Template._loginButtonsMessagesDialog.events({
		'click #messages-dialog-dismiss-button': function() {
			loginButtonsSession.resetMessages();
		}
	});

	Template._loginButtonsMessagesDialog.helpers({
		visible: function() { return messagesDialogVisible(); }
	});


	//
	// configureLoginServiceDialog template
	//

	Template._configureLoginServiceDialog.events({
		'click .configure-login-service-dismiss-button': function(event) {
			event.stopPropagation();
			loginButtonsSession.set('configureLoginServiceDialogVisible', false);
			$('#configure-login-service-dialog-modal').modal('hide');
		},
		'click #configure-login-service-dialog-save-configuration': function() {
			if (loginButtonsSession.get('configureLoginServiceDialogVisible') &&
				!loginButtonsSession.get('configureLoginServiceDialogSaveDisabled')) {
				// Prepare the configuration document for this login service
				var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');
				var configuration = {
					service: serviceName
				};
				_.each(configurationFields(), function(field) {
					configuration[field.property] = Template.instance().find('#' + 
						'configure-login-service-dialog-' + field.property).value
						.replace(/^\s*|\s*$/g, ""); // trim;
				});

				configuration.loginStyle =
				$('#configure-login-service-dialog input[name="loginStyle"]:checked')
				.val();

				// Configure this login service
				Meteor.call("configureLoginService", configuration, function(error, result) {
					if (error){
						Meteor._debug("Error configuring login service " + serviceName, error);
					} else {
						loginButtonsSession.set('configureLoginServiceDialogVisible', false);
					}
					$('#configure-login-service-dialog-modal').modal('hide');
				});
			}
		},
		// IE8 doesn't support the 'input' event, so we'll run this on the keyup as
		// well. (Keeping the 'input' event means that this also fires when you use
		// the mouse to change the contents of the field, eg 'Cut' menu item.)
		'input, keyup input': function(event) {
			// if the event fired on one of the configuration input fields,
			// check whether we should enable the 'save configuration' button
			if (event.target.id.indexOf('configure-login-service-dialog') === 0){
				updateSaveDisabled();
			}
		}
	});

	// check whether the 'save configuration' button should be enabled.
	// this is a really strange way to implement this and a Forms
	// Abstraction would make all of this reactive, and simpler.
	var updateSaveDisabled = function() {
		var anyFieldEmpty = _.any(configurationFields(), function(field) {
			return Template.instance().find('#' + 
				'configure-login-service-dialog-' + field.property).value === '';
		});

		loginButtonsSession.set('configureLoginServiceDialogSaveDisabled', anyFieldEmpty);
	};

	// Returns the appropriate template for this login service.  This
	// template should be defined in the service's package
	var configureLoginServiceDialogTemplateForService = function() {
		var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');
		return Template['configureLoginServiceDialogFor' + capitalize(serviceName)];
	};

	var configurationFields = function() {
		var template = configureLoginServiceDialogTemplateForService();
		return template.fields();
	};

	Template._configureLoginServiceDialog.helpers({
		configurationFields: function() {
			return configurationFields();
		},

		visible: function() {
			return loginButtonsSession.get('configureLoginServiceDialogVisible');
		},

		configurationSteps: function() {
			// renders the appropriate template
			return configureLoginServiceDialogTemplateForService();
		},

		saveDisabled: function() {
			return loginButtonsSession.get('configureLoginServiceDialogSaveDisabled');
		}
	});


	;



	// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js
	var capitalize = function(str) {
		str = str == null ? '' : String(str);
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

})();
