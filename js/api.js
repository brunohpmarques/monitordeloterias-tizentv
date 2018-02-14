var APIHOST = 'https://cors.now.sh/http://ec2-18-217-70-140.us-east-2.compute.amazonaws.com/loterias/api/';
var TIMEOUT = 5000;

//resultado do ultimo concurso
function getUltimoConcurso(loteria, onSuccess, onError){
	$.ajax({
	    url: APIHOST+loteria+'/resultado',
	    cache: true,
	    error: onError,
	    success: function(data) {
	    	if(data.hasOwnProperty('mensagem')){
	    		onError(data.mensagem);
	    	}else{
	    		onSuccess(data);
	    	}
		},
	    timeout: TIMEOUT
	});
}

//resultado de um concurso
function getConcurso(loteria, concurso, onSuccess, onError){
	$.ajax({
	    url: APIHOST+loteria+'/resultado/'+concurso,
	    cache: true,
	    error: onError,
	    success: function(data) {
	    	if(data.hasOwnProperty('mensagem')){
	    		onError(data.mensagem);
	    	}else{
	    		onSuccess(data);
	    	}
		},
	    timeout: TIMEOUT
	});
}

//ocorrencia das dezenas mais/menos sorteadas
function getOcorrenciaDezenas(loteria, onSuccess, onError){
	$.ajax({
	    url: APIHOST+loteria+'/ocorrencias',
	    cache: true,
	    error: onError,
	    success: function(data) {
			//console.log(data);
			if(data.hasOwnProperty('mensagem')){
	    		onError(data.mensagem);
	    	
			}else{    	
				if(loteria == 'megasena'){
					dezMaisSorteadas.megasena = data.ocorrencias;
					
				}else if(loteria == 'quina'){
					dezMaisSorteadas.quina = data.ocorrencias;
					
				}else if(loteria == 'lotofacil'){
					dezMaisSorteadas.lotofacil = data.ocorrencias;
					
				}else if(loteria == 'lotomania'){
					dezMaisSorteadas.lotomania = data.ocorrencias;
				}
				onSuccess(data);
	    	}
		},
	    timeout: TIMEOUT
	});
}

//ocorrencias de um ou parte do jogo
function getOcorrenciaJogo(loteria, jogo, onSuccess, onError){
	$.ajax({
	    url: APIHOST+loteria+'/ocorrencias/'+jogo,
	    cache: true,
	    error: onError,
	    success: function(data) {
			//console.log(data);
			if(data.hasOwnProperty('mensagem')){
	    		onError(data.mensagem);
	    	
			}else{
				onSuccess(data);
			}
		},
	    timeout: TIMEOUT
	});
}

//dezenas mais/menos sorteadas com base no dia
function getOcorrenciaDia(loteria, dia, onSuccess, onError){
	$.ajax({
	    url: APIHOST+loteria+'/ocorrencias/dia/'+dia,
	    cache: true,
	    error: onError,
	    success: function(data) {
			console.log(data);
			if(data.hasOwnProperty('mensagem')){
	    		onError(data.mensagem);
	    	
			}else{
				onSuccess(data);
			}
		},
	    timeout: TIMEOUT
	});
}

//dezenas mais/menos sorteadas com base no estado
function getOcorrenciaEstado(loteria, siglaEstado, onSuccess, onError){
	$.ajax({
	    url: APIHOST+loteria+'/ocorrencias/estado/'+siglaEstado,
	    cache: true,
	    error: onError,
	    success: function(data) {
			//console.log(data);
			if(data.hasOwnProperty('mensagem')){
	    		onError(data.mensagem);
	    	
			}else{
				onSuccess(data);
			}
		},
	    timeout: TIMEOUT
	});
}

//dezenas mais/menos sorteadas com base na regiao
function getOcorrenciaRegiao(loteria, siglaRegiao, onSuccess, onError){
	$.ajax({
	    url: APIHOST+loteria+'/ocorrencias/regiao/'+siglaRegiao,
	    cache: true,
	    error: onError,
	    success: function(data) {
			//console.log(data);
			if(data.hasOwnProperty('mensagem')){
	    		onError(data.mensagem);
	    	
			}else{
				onSuccess(data);
			}
		},
	    timeout: TIMEOUT
	});
}
