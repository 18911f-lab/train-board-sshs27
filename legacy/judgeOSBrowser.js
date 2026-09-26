//OS・ブラウザを判別する
/*
 * if.useragent.js v0.1
 * info: http://company.miyanavi.net/archives/808
 * auther: miyanavi
 * licence: MIT
 *
 */

uaName = 'unknown';
userAgent = window.navigator.userAgent.toLowerCase();
appVersion = window.navigator.appVersion.toLowerCase();

if (userAgent.indexOf('msie') != -1) {
	uaName = 'ie';
	if (appVersion.indexOf('msie 6.') != -1) {
		uaName = 'ie6';
	} else if (appVersion.indexOf('msie 7.') != -1) {
		uaName = 'ie7';
	} else if (appVersion.indexOf('msie 8.') != -1) {
		uaName = 'ie8';
	} else if (appVersion.indexOf('msie 9.') != -1) {
		uaName = 'ie9';
	} else if (appVersion.indexOf('msie 10.') != -1) {
		uaName = 'ie10';
	}
} else if (userAgent.indexOf('chrome') != -1) {
	uaName = 'chrome';
} else if (userAgent.indexOf('ipad') != -1) {
	uaName = 'ipad';
} else if (userAgent.indexOf('ipod') != -1) {
	uaName = 'ipod';
} else if (userAgent.indexOf('iphone') != -1) {
	uaName = 'iphone';
	var ios = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	uaName = [parseInt(ios[1], 10), parseInt(ios[2], 10), parseInt(ios[3] || 0, 10)];
} else if (userAgent.indexOf('safari') != -1) {
	uaName = 'safari';
} else if (userAgent.indexOf('gecko') != -1) {
	uaName = 'gecko';
} else if (userAgent.indexOf('opera') != -1) {
	uaName = 'opera';
} else if (userAgent.indexOf('android') != -1) {
	uaName = 'android';
} else if (userAgent.indexOf('mobile') != -1) {
	uaName = 'mobile';
};

///// OSの判定
//  http://www9.plala.or.jp/oyoyon/html/script/platform.html
//os;
var ua = navigator.userAgent;
if (ua.match(/Win(dows )?NT 6\.2/)) {
	os = "Windows 8";				// Windows 8 の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?NT 6\.1/)) {
	os = "Windows 7";				// Windows 7 の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?NT 6\.0/)) {
	os = "Windows Vista";				// Windows Vista の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?NT 5\.2/)) {
	os = "Windows Server 2003";			// Windows Server 2003 の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
	os = "Windows XP";				// Windows XP の処理
	os = "Windows"
}
else if (ua.match(/Win(dows)? (9x 4\.90|ME)/)) {
	os = "Windows ME";				// Windows ME の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?(NT 5\.0|2000)/)) {
	os = "Windows 2000";				// Windows 2000 の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?98/)) {
	os = "Windows 98";				// Windows 98 の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?NT( 4\.0)?/)) {
	os = "Windows NT";				// Windows NT の処理
	os = "Windows"
}
else if (ua.match(/Win(dows )?95/)) {
	os = "Windows 95";				// Windows 95 の処理
	os = "Windows"
}
else if (ua.match(/Mac|PPC/)) {
	os = "Mac OS";					// Macintosh の処理
}
else if (ua.match(/Linux/)) {
	os = "Linux";					// Linux の処理
}
else if (ua.match(/^.*\s([A-Za-z]+BSD)/)) {
	os = RegExp.$1;					// BSD 系の処理
}
else if (ua.match(/SunOS/)) {
	os = "Solaris";					// Solaris の処理
}
else {
	os = "N/A";					// 上記以外 OS の処理
}
