i18n.setDefaultLanguage('en')

accountsUIBootstrap3 = {
	setLanguage: function (lang) {
		return i18n.setLanguage(lang)
	},
	getLanguage: function () {
		return i18n.getLanguage()
	},
	map: function (lang, obj) {
		return i18n.map(lang, obj)
	}
}
