var dirResApp = 'documents';
var filePrefPath = 'preferencias.json';
var noCallback = function(){}
var preferencias = {alertMega:false, alertQuina:false, alertLotof:false, alertLotom:false};
var dezMaisSorteadas = {megasena:[], quina:[], lotofacil:[], lotomania:[]};
var listaConcursos = {megasena:null, quina:null, lotofacil:null, lotomania:null};

function setPreferencia(loteria, valor, onSuccess, onError, onFinally){
	if(loteria == 'megasena'){
		preferencias.alertMega = valor;
	}else if(loteria == 'quina'){
		preferencias.alertQuina = valor;
	}else if(loteria == 'lotofacil'){
		preferencias.alertLotof = valor;
	}else if(loteria == 'lotomania'){
		preferencias.alertLotom = valor;
	}
	
	var alarmId;
	if(valor){
		alarmId = resource.getItem('al'+loteria);
		if(alarmId == null){
			alarmId = createAlarme(loteria);
			resource.setItem('al'+loteria, alarmId);
		}
	}else{
		alarmId = resource.getItem('al'+loteria);
		removeAlarme(alarmId);
	}
	resource.preferencias = JSON.stringify(preferencias);
}



function existe(dirRes, filePath, onTrue, onFalse, onFinally) {
	onTrue = onTrue == null? noCallback : onTrue;
	onFalse = onFalse == null? noCallback : onFalse;
	onFinally = onFinally == null? noCallback : onFinally;
	try{

		console.log('existe():called');
		tizen.filesystem.resolve(dirRes, function(dir) {
			var file = null;
			console.log('existe():searching - '+dir.listFiles.length);
			for (var i = 0; i < dir.listFiles.length; i++) {
				console.log(dir.listFiles[i].name);
				if(dir.listFiles[i].name == filePath){
					file = dir.listFiles[i];
					break;
				}
			}
			if(file == null){
				console.log('existe():false');
				onFinally();
				onFalse(dir);
			}else {
				console.log('existe():true');
				onFinally();
				onTrue();
			}
			console.log('existe():complete');
		});
	}catch(e){
		console.log('existe()');
		console.log(e);
		onFinally();
	}
}

function ler(dirRes, filePath, onSuccess, onError, onFinally) {
	console.log('Reading file');
	onSuccess = onSuccess == null? noCallback : onSuccess;
	onError = onError == null? noCallback : onError;
	onFinally = onFinally == null? noCallback : onFinally;
	try{
		tizen.filesystem.resolve((dirRes+'/'+filePath), function(file) {
			file.readAsText(function(str){
				onSuccess(str);
				onFinally();
				});
		    }, function() {
		    	onError();
		    	onFinally();
			}, 'r');
	}catch (e) {
		console.log('ler()');
		console.log(e);
		onError();
		onFinally();
	}
}

function gravar(dirRes, filePath, content, onSuccess, onError, onFinally) {
	console.log('Writing file');
	onSuccess = onSuccess == null? noCallback : onSuccess;
	onError = onError == null? noCallback : onError;
	onFinally = onFinally == null? noCallback : onFinally;
	try{
		tizen.filesystem.resolve(dirRes, function(dir) {
			console.log(dir.listFiles);
			var file = null;
			for (var i = 0; i < dir.listFiles.length; i++) {
				if(dir.listFiles[i].name == filePath){
					file = dir.listFiles[i];
					break;
				}
			}
			if(file == null){
				file = dir.createFile(filePath);
			}
			file.openStream('w', function(fs) {
				fs.write(content);
				fs.close();
				onSuccess();
				onFinally();
				console.log('Write success');
			}, function(e) {
				console.log('gravar()');
				console.log(e);
				onError();
				onFinally();
			}, 'UTF-8');
		});
	}catch(e){
		console.log('gravar()');
		console.log(e);
		onError();
		onFinally();
	}
}