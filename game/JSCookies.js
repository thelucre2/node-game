var JSCookies = {

	defaults: {
		expiryDays: 7
	},

	createCookie: function(name, value, days) {
		if (!days) {
			days = this.defaults.expiryDays;
		} else {}

		date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();

		document.cookie = name + "=" + value + expires + "; path=/";

		return {"name": name, "value": value};
	},

	readCookie: function(name) {
		nameEQ = name + "=";
		ca = $(document.cookie.split(";"));
		for (i = 0; i < ca.length; i++) {
			c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length, c.length);
			} else {}
		}
		return "";
	},

	eraseCookie: function(name) {
		this.createCookie(name, "", -1);
		return {"name": name, "value": null};
	}
};
