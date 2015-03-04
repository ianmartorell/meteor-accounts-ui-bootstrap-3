meteor-accounts-ui-bootstrap-3
==============================

Meteor accounts-ui styled with Twitter's Bootstrap 3, now with multi-language support.

Installation
------------

With Meteor 0.9:

```sh
$ meteor add twbs:bootstrap
$ meteor add ian:accounts-ui-bootstrap-3
```

[twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap) is the recommended Meteor implementation of Twitter's Bootstrap, and is declared as a weak dependency in this package. If you're using your own Bootstrap package, you're on your own regarding load order problems.

You will also need at least one accounts plugin: `meteor add accounts-password`, `meteor add accounts-github`, etc.

How to use
----------

Add `{{> loginButtons}}` to your template

Example:

```html
<div class="navbar navbar-default" role="navigation">
	<div class="navbar-header">
		<a class="navbar-brand" href="#">Project name</a>
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
	</div>
	<div class="navbar-collapse collapse">
		<ul class="nav navbar-nav">
			<li class="active"><a href="#">Link</a></li>
		</ul>
		<ul class="nav navbar-nav navbar-right">
			{{> loginButtons}} <!-- here -->
		</ul>
	</div>
</div>
```

You can also configure `Accounts.ui` to your liking as you would [with the official `accounts-ui` package](https://docs.meteor.com/#/full/accounts_ui_config).

### Add additional logged in actions

You can add additional markup to the logged in dropdown, e.g. to edit
the user's account or profile, by defining a 
`_loginButtonsAdditionalLoggedInDropdownActions` template and specifying
the corresponding events.

```html
<template name="_loginButtonsAdditionalLoggedInDropdownActions">
	<button class="btn btn-default btn-block" id="login-buttons-edit-profile">Edit profile</button>
</template>
```

```javascript
Template._loginButtonsLoggedInDropdown.events({
	'click #login-buttons-edit-profile': function(event) {
		Router.go('profileEdit');
	}
});
```

Note that the dropdown will close since we're not stopping the propagation of the click event.


### Custom signup options

You can define additional input fields to appear in the signup form, and you can decide wether to save these values to the profile
object of the user document or not. Specify an array of fields using `Accounts.ui.config` like so:

```javascript
Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'first-name',
        fieldLabel: 'First name',
        inputType: 'text',
        visible: true,
        saveToProfile: true
    }, {
        fieldName: 'last-name',
        fieldLabel: 'Last name',
        inputType: 'text',
        visible: true,
        saveToProfile: true
    }, {
        fieldName: 'terms',
        fieldLabel: 'I accept the terms and conditions',
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false
    }]
});
```

#### Result:

![Custom signup form example](http://i.imgur.com/pvd5L1U.png)

Alternatively, if you prefer to pass values directly to the `onCreateUser` function, without creating new fields in the signup form,
you can use the `accountsUIBootstrap3.setCustomSignupOptions` function. If it exists, the returned value is handled as the initial options object,
which is later available in `onCreateUser` on the server. For example:

```javascript
accountsUIBootstrap3.setCustomSignupOptions = function() {
    return {
    	referrerId: Session.get('referrerId') // Or whatever
    }
}
```

### Disable User Account Creation

If you would like to prevent users from creating new accounts, you can choose to not show the account creation buttons as shown below.

```javascript
Accounts.ui.config({
    forbidClientAccountCreation : true
});
```

While this flag prevents the user from seeing the "Create Account" link, the server will still accept new accounts. You can prevent new account creation altogether by always returning false in the [account validation stage](http://docs.meteor.com/#/full/accounts_validatenewuser) on the server. Here is an example (place in server-side code):

```javascript
Accounts.validateNewUser(function (user){
    return false;
});
```

### Logout callback

If the function `accountsUIBootstrap3.logoutCallback` exists, it will be called as the callback of Meteor.logout. For example:

```javascript
accountsUIBootstrap3.logoutCallback = function(error) {
    if(error) console.log("Error:" + error);
    Router.go('home');
}
```

### Localization

The default language is English, but this package also comes with translations to many other languages built in. If you want to change the language run one of the following on the client:

```javascript
accountsUIBootstrap3.setLanguage('es'); // for Spanish
accountsUIBootstrap3.setLanguage('ca'); // for Catalan
accountsUIBootstrap3.setLanguage('fr'); // for French
accountsUIBootstrap3.setLanguage('de'); // for German
accountsUIBootstrap3.setLanguage('it'); // for Italian
accountsUIBootstrap3.setLanguage('pt-PT'); // for Portuguese (Portugal)
accountsUIBootstrap3.setLanguage('pt-BR'); // for Portuguese (Brazil)
accountsUIBootstrap3.setLanguage('ru'); // for Russian
accountsUIBootstrap3.setLanguage('el'); // for Greek
accountsUIBootstrap3.setLanguage('ko'); // for Korean
accountsUIBootstrap3.setLanguage('ar'); // for Arabic
```

If you want to implement your own language, use the `map` function like so:

```javascript
accountsUIBootstrap3.map('es', {
    _resetPasswordDialog: {
        title: 'Restablece tu contraseña',
        cancel: 'Cancelar',
        submit: 'Guardar'
    },
    _enrollAccountDialog: {
        title: 'Escribe una contraseña',
        cancel: 'Cerrar',
        submit: 'Guardar contraseña'
    },
    // ...
})
```

You can use the translation files in the `i18n` folder as an example.

Screenshots
-----------

![Sign In](http://i.imgur.com/SGLZkOE.png)
![Sign Up](http://i.imgur.com/7S3C18J.png)
![Configure Login Service](http://i.imgur.com/Noa7sSm.png)
