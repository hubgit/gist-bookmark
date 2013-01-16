var absoluteURL = function(url) {
	var node = document.createElement("a");
	a.setAttribute("href", url);
	return a.href;
}

var detectPDF = function() {
	var nodes;

	nodes = document.querySelectorAll("link[rel='alternate'][type='application/pdf'][href]");

	if (nodes.length) {
		return nodes[0].getAttribute("href");
	}

	nodes = document.querySelectorAll("meta[name='citation_pdf_url'][content]");

	if (nodes.length) {
		return nodes[0].getAttribute("content");
	}

	var nodes = document.querySelectorAll("a[href]");

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		var href = node.getAttribute("href");

		if (href.match(/pdf/i)) {
			return href;
		}
	}

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		var text = node.textContent;

		if (text.match(/pdf/i)) {
			return href;
		}
	}
}

var detectMeta = function() {
	var data = {};

	nodes = document.querySelectorAll("meta[name^=citation_][content]");

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		var name = node.getAttribute("name");
		var content = node.getAttribute("content");

		if (typeof data[name] == "undefined") {
			data[name] = content;
		} else if (typeof data[name] == "string") {
			data[name] = [data[name], content];
		} else {
			data[name].push(content);
		}
	}

	return data;
}

var data = detectMeta();

data.url = document.location.href;
data.title = document.title;

var selection = document.getSelection().toString();
data.quote = selection ? '"' + selection + '"' : "";

//data.tag = prompt("tags", "bookmark");

console.log(data);

var gist = {
	"description": data.citation_title ? data.citation_title : data.title,
	"public": false,
	"files": {
		"metadata.json": {
			"content": JSON.stringify(data)
		}
	}
};

//var xhr = new XMLHttpRequest;
//xhr.open("POST", "https://api.github.com/gists", true);
//xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

//xhr.onload = function(){
	//console.log(this);
	//if (this.readyState == 4 && this.status == 201) {
		//console.log(this);

		//var response = JSON.parse(this.response);

		//var gistURL = response.url;
		//console.log(gistURL);

		var pdf = detectPDF();

		if (pdf) {
			var xhr = new XMLHttpRequest;
			xhr.open("GET", pdf, true);
			xhr.responseType = "arraybuffer";

			xhr.onerror = function(event){
				console.log(event);
			};

			xhr.onload = function(event) {
				if (this.status != 200) {
					console.log(event);
					return;
				}

				console.log(this);
				console.log(this.response.byteLength);
				console.log("Content-Type: " + this.getResponseHeader("Content-Type"));
				console.log("Content-Length: " + this.getResponseHeader("Content-Length"));

				//var dataView = new DataView(this.response);
				//var blob = new Blob([dataView], { type: "application/pdf" });

				var uInt8Array = new Uint8Array(this.response);
			    var i = uInt8Array.length;
			    var binaryString = new Array(i);
			    while (i--) {
			      binaryString[i] = String.fromCharCode(uInt8Array[i]);
			    }
			    var data = binaryString.join('');
			    var base64 = window.btoa(data);

			    /*
				var update = {
					"files": {
						"item.pdf": {
							"content": base64
						}
					}
				};
				*/

				gist.files["item.pdf"] = { content: base64 };

				//var formData = new FormData;
				//formData.append("pdf", blob);

				var xhr = new XMLHttpRequest;
				//xhr.open("PATCH", gistURL, true);
				xhr.open("POST", "https://api.github.com/gists", true);
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

				xhr.onload = function(event) {
					var data = JSON.parse(this.response);
					console.log(data);
					console.log(data.html_url);
				};

				var content = JSON.stringify(gist);
				//var content = JSON.stringify(update);

				xhr.send(content);
			};

			xhr.send();
		}
	//}
//};

//var content = JSON.stringify(gist);
//xhr.send(content);

//xhr.onerror = function(event){
//	console.log(event);
//};

data;
