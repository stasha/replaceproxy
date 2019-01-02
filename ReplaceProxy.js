var replace = [
	{
		type: 'request',
		urls: [
			'https://ssl.gstatic.com/gb/images/i1_1967ca6a.png',
			'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png'
		], 
		replaceUrl: 'http://eskipaper.com/images/beautiful-girls-19.jpg'
	},
	{
		type: 'request',
		urls: [
			'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
		], 
		replaceUrls: [
			'http://4.bp.blogspot.com/-1IBcwG4SGk8/U2BuAq7qnSI/AAAAAAAALgI/dEDoBj-AY7c/s1600/Girl+Animation.gif'
		]
	},
	{
		type: 'response',
		urls: [
			'https://www.google.com/xjs/_/js/k=xjs.s.cs.vSbrToOOKB4.O/m=sx,sb,cdos,cr,elog,hsm,.*'
		], 
		replaceContent: '/home/stasha/test'
	}
];



var File = Java.type('java.io.File');
var URI = Java.type('org.apache.commons.httpclient.URI');
var Scanner = Java.type('java.util.Scanner');

function update(msg) {

	if(typeof replace == "undefined") {
		return;
	}

	for(var i = 0; i < replace.length; ++i) {

		var item = replace[i];

		for(var u = 0; u < item.urls.length; ++u) {

			var url = new RegExp(item.urls[u]);

			
			if(!url.test(msg.getRequestHeader().getURI())) {
				continue;
			}
	
			if (item.type == null) {
				print('\'type\' property is not set on replacement intem.');
				return;
			}
	
			switch(item.type) {
				case 'request':
					if(item.replaceUrl != null) {
						msg.getRequestHeader().setURI(new URI(item.replaceUrl));
					} else if (item.replaceUrls != null) {
						var rurl = item.replaceUrls[u];
						msg.getRequestHeader().setURI(new URI(rurl));
					}
				break;
				case 'response':
					if(item.replaceContent != null) {
						var content = new Scanner(new File(item.replaceContent)).useDelimiter("\\Z").next();
						msg.setResponseBody(content);
					} else if (item.replaceContents != null) {
						var content = new Scanner(new File(item.replaceContent[u])).useDelimiter("\\Z").next();
						msg.setResponseBody(content);
					}
					
				break;
				default: 
					print('Only \'request\' and \'response\' replacement types are supported.');
					return;
			}
		}
	}
}

function proxyRequest(msg) {
	update(msg);
	
	return true;
}

function proxyResponse(msg) {
	update(msg);

	return true;
}

