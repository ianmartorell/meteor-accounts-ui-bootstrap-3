Package.describe({
	name: 'ian:accounts-ui-bootstrap-3',
	summary: 'Bootstrap-styled accounts-ui with multi-language support.',
	version: '1.2.89',
	git: "https://github.com/ianmartorell/meteor-accounts-ui-bootstrap-3"
})

Package.on_use(function (api) {
	api.use(['session@1.0.0',
		'spacebars@1.0.0',
		'accounts-base@1.0.0',
		'underscore@1.0.0',
		'templating@1.0.0',
		'anti:i18n@0.4.3'
		],'client')

	api.imply('accounts-base', ['client', 'server']);

	// Allows the user of this package to choose their own Bootstrap
	// implementation.
	api.use(['twbs:bootstrap@3.3.1',
					'nemo64:bootstrap@3.3.1_1'],
					'client', {weak: true});
	// Allows us to call Accounts.oauth.serviceNames, if there are any OAuth
	// services.
	api.use('accounts-oauth@1.0.0', {weak: true});
	// Allows us to directly test if accounts-password (which doesn't use
	// Accounts.oauth.registerService) exists.
	api.use('accounts-password@1.0.0', {weak: true});

	api.add_files([
		'accounts_ui.js',

		// translations
		'i18n/en.i18n.js',
		'i18n/es.i18n.js',
		'i18n/ca.i18n.js',
		'i18n/fr.i18n.js',
		'i18n/de.i18n.js',
		'i18n/it.i18n.js',
		'i18n/pt-PT.i18n.js',
		'i18n/pt-BR.i18n.js',
		'i18n/pt.i18n.js',
		'i18n/ru.i18n.js',
		'i18n/el.i18n.js',
		'i18n/ko.i18n.js',
		'i18n/ar.i18n.js',
		'i18n/pl.i18n.js',
		'i18n/zh-CN.i18n.js',
		'i18n/zh-TW.i18n.js',
		'i18n/zh.i18n.js',
		'i18n/nl.i18n.js',
		'i18n/ja.i18n.js',
		'i18n/he.i18n.js',
		'i18n/sv.i18n.js',
		'i18n/uk.i18n.js',
		'i18n/fi.i18n.js',
		'i18n/vi.i18n.js',
		'i18n/sk.i18n.js',
		'i18n/be.i18n.js',
		'i18n/fa.i18n.js',
		'i18n/sr-Cyrl.i18n.js',
		'i18n/sr-Latn.i18n.js',
		'i18n/sr.i18n.js',
		'i18n/hu.i18n.js',
		'i18n.js',

		'login_buttons.html',
		'login_buttons_single.html',
		'login_buttons_dropdown.html',
		'login_buttons_dialogs.html',

		'login_buttons_session.js',

		'login_buttons.js',
		'login_buttons_single.js',
		'login_buttons_dropdown.js',
		'login_buttons_dialogs.js',
		'accounts_ui.css'
		], 'client')

	api.export('accountsUIBootstrap3', 'client')
})
