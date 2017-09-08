var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var server = http.createServer(function handler(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
}).listen(1337, '127.0.0.1', function() {
	console.log('Server running at http://127.0.0.1:1337/');
});

server.on('listening', function() {
	console.log('listening...');
});

server.on('error', function(err) {
	fs.appendFile('D:/Development_tools/workspace_HBuilder/nodeService/error.log', new Date() + ": " + err.toString(), function() {});
});

server.on('request', function(req, res) {
	try {
		var result = dealRequest(req, res);
	} catch(e) {
		var result = fail("dealRequest error!");
	}
	res.write(JSON.stringify(result) + "");
	res.end();
});

function dealRequest(request, res) {
	var urlStr = url.parse(request.url);
	var queryArgs = querystring.parse(urlStr.query);
	var res_str, stat, result;
	switch(urlStr.pathname) {
		case '/switchConfigFile':
			result = switchConfigFile(queryArgs);
			break;
		case '/switchDbFile':
			result = switchDbFile(queryArgs);
			break;
		case '/switchLog4jFile':
			result = switchLog4jFile(queryArgs);
			break;
		case '/switchAliOutUrlDbFile':
			result = switchAliOutUrlDbFile();
			break;
		default:
			result = success();
			break;
	}
	return result;
}

/**
 * 是否注释 log4j.properties
 * @param {Object} queryArgs
 */
function switchLog4jFile(queryArgs) {
	var result = success();
	var showConsole = queryArgs.showConsole;
	var targetFile = "D:/Development_tools/workspace_eclipse/epark/resource/log4j.properties";
	var originalFile = (showConsole == "true" ? "./log4j_show" : "./log4j_hide");
	try {
		fs.readFile(originalFile, function(err, buf) {
			if(!err) {
				fs.writeFileSync(targetFile, buf.toString(), "utf-8", function() {
					result = success();
				})
			}
		});
	} catch(e) {
		result = fail(e);
	}
	return result;
}

/**
 * 转换 config.properties
 */
function switchConfigFile(queryArgs) {
	var result = success();
	var projectName = queryArgs.projectName;
	var fileBase = "D:/Development_tools/workspace_eclipse/epark/resource/config/";
	var targetFile = "D:/Development_tools/workspace_eclipse/epark/resource/config.properties";
	try {
		fs.readFile(fileBase + "config_" + projectName + ".properties", function(err, buf) {
			if(!err) {
				fs.writeFileSync(targetFile, buf.toString(), "utf-8", function() {
					result = success();
				})
			}
		});
	} catch(e) {
		result = fail(e);
	}
	return result;
}

/**
 * 切换 db.properties
 */
function switchDbFile(queryArgs) {
	var result = success();
	var projectName = queryArgs.projectName;
	var fileBase = "D:/Development_tools/workspace_eclipse/epark/resource/dbConfig/";
	var targetFile = "D:/Development_tools/workspace_eclipse/epark/resource/db.properties";
	try {
		fs.readFile(fileBase + "db_" + projectName + ".properties", function(err, buf) {
			if(!err) {
				fs.writeFileSync(targetFile, buf.toString(), "utf-8", function() {
					result = success();
				})
			}
		});
	} catch(e) {
		result = fail(e);
	}
	return result;
}

/**
 * 切换 ALi的外网配置 db.properties
 */
function switchAliOutUrlDbFile() {
	var result = success();
	var targetFile = "D:/Development_tools/workspace_eclipse/epark/resource/db.properties";
	var arr = [];
	arr[0] = "#=========================阿里云特易停数据库【外网】配置===============";
	arr[1] = "jdbc.driver=org.gjt.mm.mysql.Driver";
	arr[2] = "#[QingDao-Ali] teyiting environment";
	arr[3] = "jdbc.url=jdbc:mysql://172.16.2.251:3306/epark?useUnicode=true&characterEncoding=utf8";
	arr[4] = "jdbc.username=bitcom";
	arr[5] = "jdbc.password=Bitcom666";
	arr[6] = "jdbc.pool.initialSize=5";
	arr[7] = "jdbc.pool.maxActive=20";
	arr[8] = "jdbc.pool.minIdle=5";
	arr[9] = "jdbc.pool.maxIdle=8";
	arr[10] = "jdbc.validationQueryTimeout=3";

	var str = "";
	for(var i = 0; i < arr.length; i++) {
		str += arr[i] + "\n";
	}
	try {
		fs.writeFileSync(targetFile, str, "utf-8");
	} catch(e) {
		result = fail(e);
	}
	return result;
}

function success() {
	return {
		"code": "0",
		"message": "success"
	}
}

function fail(e) {
	return {
		"code": "1",
		"message": "error",
		"exception": e
	}
}