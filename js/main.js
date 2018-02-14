/*
 * 
 * http://developer.samsung.com/tv/develop/guides/user-interaction/remote-control
 * http://developer.samsung.com/tv/develop/guides/data-handling/using-web-storage
 * http://developer.samsung.com/tv/develop/api-references/tizen-web-device-api-references/alarm-api/
 * 
 * OK - Consultar resultados, prêmios, acumulados e ganhadores;
 * OK - Recomendação de jogos com parâmetros (data, região, dezenas mais sorteadas, etc);
 * OK - Verificar se houve premiação para um jogo ou parte dele;
 * OK - Lembrete para jogar nas loterias;
 */

var app;
var currentPage;
var currentSubpage;
var appOptions;
var appOptionsCnt = 0;
var modalLoad;
var modalAlert;
var msgErroConexao = 'Verifique sua conexão com a internet';

function setKeyslistener(){
    	document.addEventListener('keydown', function(e) {
    		e.preventDefault();
    		//console.log('Key code : ' + e.keyCode);
    		
    		if(app.hasClass('keyboard-concurso')){
    			var campo = app.attr('data-input');
    			var btnEnter = app.attr('data-enter');
    			campo = $('#'+campo);
    			var tecla = e.keyCode-48;
    			
    			if(tecla >= 0 && tecla <= 9){
    				campo.val(campo.val()+''+tecla);
    				return false;
    				
    			}else if(e.keyCode == 13 || e.keyCode == 10225){ // enter ou search
    				$('#'+btnEnter).click();
    				
    			}else if(e.keyCode == 37 || e.keyCode == 65385){ // back 65385
    				var dataLength = campo.val().length;
    				if(dataLength > 0){
    					campo.val(campo.val().substring(0, dataLength-1));
    					return false;
    				}
    			}
    			app.removeClass('keyboard-concurso');
    			campo.removeClass('focus');
    			$('[data-toggle="tooltip"]').tooltip('hide');
    			return false;
    		
    		}else if(app.hasClass('keyboard-ocorrencias')){
    			var campo = app.attr('data-input');
    			var btnEnter = app.attr('data-enter');
    			campo = $('#'+campo);
    			var tecla = e.keyCode-48;
    			
    			if(tecla >= 0 && tecla <= 9){
    				campo.val(campo.val()+''+tecla);
    				var dezVal = campo.val();
    				if(dezVal.length == 2){
        				campo.val('');
        				var tds = $('table td', currentSubpage);
        				var td = null;
        				for (var i = 0; i < tds.length; i++) {
							td = $(tds[i]);
							if(td.text() == dezVal) break;
							if(td.text().length == 2) continue;
							td.text(dezVal);
							break;
						}
    				}
    				return false;
    				
    			}else if(e.keyCode == 13 || e.keyCode == 10225){ // enter ou search
    				$('#'+btnEnter).click();
    				
    			}else if(e.keyCode == 37 || e.keyCode == 65385){ // back 65385
    				var dataLength = campo.val().length;
    				if(dataLength == 1){
    					campo.val('');
    				}else{
    					var tds = $('table td', currentSubpage);
        				var td = null;
        				for (var i = tds.length-1; i >= 0; i--) {
							td = $(tds[i]);
							if(td.text() == '-') continue;
							td.text('-');
							break;
						}
    				}
    				return false;
    			}
    			app.removeClass('keyboard-ocorrencias');
    			campo.removeClass('focus');
    			$('[data-toggle="tooltip"]').tooltip('hide');
    			return false;
    		}
    		
	    	var keycode = null;
	    	switch(e.keyCode){
	        case 48: //0
	        	var modal = $('.modal.modal-page.in');
	            if(modal.length > 0){
	            	keycode = $('.keycode-0', modal);
	            }else{
	            	keycode = $('.keycode-0').not('.modal .keycode-0');
	            }
	        	break;
	        case 49: //1
	        	keycode = $('.keycode-1', currentPage);
	        	break;
	        case 50: //2
	        	keycode = $('.keycode-2', currentPage);
	        	break;
	        case 51: //3
	        	keycode = $('.keycode-3', currentPage);
	        	break;
	        case 52: //4
	        	keycode = $('.keycode-4', currentPage);
	        	break;
	        case 53: //5
	        	keycode = $('.keycode-5', currentSubpage);
	        	break;
	        case 54: //6
	        	keycode = $('.keycode-6', currentSubpage);
	        	break;
	        case 55: //7
	        	keycode = $('.keycode-7', currentSubpage);
	        	break;
	        case 56: //8
	        	keycode = $('.keycode-8', currentSubpage);
	        	break;
	        case 57: //9
	        	keycode = $('.keycode-9', currentSubpage);
	        	break;
	        	
	        case 404: //GREEN
	        	setPage('loteria');
	        	setSubpage('resultado', 'megasena');
	            break;
	        case 406: //BLUE
	        	setPage('loteria');
	        	setSubpage('resultado', 'quina');
	            break;
	        case 405: //YELLOW
	        	setPage('loteria');
	        	setSubpage('resultado', 'lotofacil');
	            break;
	        case 403: //RED
	        	setPage('loteria');
	        	setSubpage('resultado', 'lotomania');
	            break;
	            
	        case 37: //LEFT
	            backAppOption();
	            break;
	        case 38: //UP
	        	backAppOption();
	            break;
	        case 39: //RIGHT
	            nextAppOption();
	            break;
	        case 40: //DOWN
	            nextAppOption();
	            break;
	        case 13: //ENTER
	        	keycode = $(':focus');
	            break;
	        case 65385: //BACK
	        	$('#btnSair').click();
	            break;
	        case 10182: // Exit
	        	$('#btnSair').click();
	        	break;
	        case 457: //INFO 73
	        	var btnAtalhos = $('#btnAtalhos');
	        	btnAtalhos.click();
	        	btnAtalhos.focus();
	            break;
	        default:
	            console.log('Key code : ' + e.keyCode);
	            break;
	        }
	    	
	    	if(keycode != null){
        		keycode.click();
        		keycode.focus();
        	}
        }); 
    	return false;
}

function setPage(pageId){
    if(pageId != null){
        var pages = $('.page.active');
        pages.removeClass('active');
        currentPage = $('#'+pageId+'.page');
        currentPage.addClass('active');
        currentSubpage = '';
        setAppOptions();
    }
}

function setSubpage(subpageId, loteria){
    if(subpageId != null && loteria != null){
    	var lotPage = $('#loteria');
    	var modalRegioes = $('#modalRegioes');
    	var beforeLot = lotPage.attr('data-lot');
    	lotPage.attr('data-lot', loteria);
    	lotPage.removeClass('theme-'+beforeLot);
    	lotPage.addClass('theme-'+loteria);
    	$('#lotTitle', lotPage).text(loteria);
    	$('#lotImage', lotPage).attr('src', 'images/'+loteria+'.svg');
    	
    	modalRegioes.removeClass('theme-'+beforeLot);
    	modalRegioes.addClass('theme-'+loteria);
    	
    	if(subpageId == 'resultado'){
    		$('#campoConcurso').val('');
	    	var lotResultado = null;
	    	if(loteria == 'megasena' && listaConcursos.megasena != null){
	    		lotResultado = listaConcursos.megasena;
	    		
	    	}else if(loteria == 'quina' && listaConcursos.quina != null){
	    		lotResultado = listaConcursos.quina;
	    		
	    	}else if(loteria == 'lotofacil' && listaConcursos.lotofacil != null){
	    		lotResultado = listaConcursos.lotofacil;
	    		
	    	}else if(loteria == 'lotomania' && listaConcursos.lotomania != null){
	    		lotResultado = listaConcursos.lotomania;
	    	}
	    	
	    	showModalLoad();
	    	if(lotResultado == null){
		    	// carregar ultimo jogo da loteria
	    		getUltimoConcurso(loteria, 
		    	    	function(resultado){ // success
		    				showResultado(resultado);
		    				hideModalLoad();
		    	    	}, function(e){ // error
		    	    		hideModalLoad();
		    	    		showModalAlert(msgErroConexao);
		    	    	}
		    	);
	    	}else{
	    		showResultado(lotResultado);
				hideModalLoad();
	    	}
	    	
    	}else if(subpageId == 'sobre'){
    		$('#sobre .card-body').hide();
    		var lotSobre = $('#sobre #sobre'+loteria);
    		lotSobre.show();
    		var d = new Date();
    		d = d.getDay();
    		$('tbody td', lotSobre).removeClass('hoje');
    		$($('tbody td', lotSobre).get(9+d)).addClass('hoje');
    		
    	}else if(subpageId == 'sugestoes'){
    		
    	}else if(subpageId == 'ocorrencias'){
    		$('#campoOcorrencias').val('');
    		var modalJogo = $('#modalJogo');
    		var table = $('table', modalJogo);
    		$('tbody', table).hide();
    		$('td', table).text('-');
    		var tbodyLot = $('#table'+loteria, table);
    		tbodyLot.show();
    		$('#ocorrencias.subpage table', currentPage).html(tbodyLot.clone());
    	}
    	
        var pages = $('.subpage.active');
        pages.removeClass('active');
        currentSubpage = $('#'+subpageId+'.subpage');
        currentSubpage.addClass('active');
        setAppOptions();
    }
}

function showResultado(resultado){
	$('#campoConcurso').val('');
	$('#lotConcurso', currentPage).text(resultado.concurso);
	$('#lotData', currentPage).text(formatarData(resultado.data.date));
	$('#lotGanhadores', currentPage).text(resultado.ganhadores);

	if(resultado.ganhadores == 0){
		$('#lotAcumulou', currentPage).attr('style','display:block !important');
		$('#lotIsAcumulou', currentPage).attr('style','display:block !important');
		$('#lotIsAcumuladoVal', currentPage).text(formatarReal(resultado.valorAcumulado));
		$('#lotIsPremio', currentPage).attr('style','display:none !important');
		
	}else{
		$('#lotAcumulou', currentPage).attr('style','display:none !important');
		$('#lotIsAcumulou', currentPage).attr('style','display:none !important');
		$('#lotIsPremio', currentPage).attr('style','display:block !important');
		$('#lotPremioVal', currentPage).text(formatarReal(resultado.premio));
	}
	
	var modalJogo = $('#modalJogo');
	$('#descricao', modalJogo).hide();
	var tds = $('table tbody#table'+resultado.loteria+' td', modalJogo);
	for (var i = 0; i < tds.length; i++) {
		$(tds.get(i)).text(resultado.dezenas[i]);
	}
	
	if(resultado.loteria == 'megasena'){
		listaConcursos.megasena = resultado;
	}else if(resultado.loteria == 'quina'){
		listaConcursos.quina = resultado;
	}else if(resultado.loteria == 'lotofacil'){
		listaConcursos.lotofacil = resultado;
	}else if(resultado.loteria == 'lotomania'){
		listaConcursos.lotomania = resultado;
	}
}

function setAppOptions(){
    var modal = $('.modal.modal-page.in');
    if(modal.length > 0){
        appOptions = $('.appOption', modal);
        $(appOptions.get(0)).focus();
        appOptionsCnt = 0;
    }else{
        var appOptPage = $('.appOption', currentPage).not('.subpage .appOption');
        var appOptSubpage = $('.jumbotron, .subpage.active .appOption', currentPage);
        $(appOptPage.get(0)).focus();
        appOptions = $('.navbar .appOption');
        appOptionsCnt = appOptions.length;
        for (var i = 0; i < appOptPage.length; i++) {
            appOptions.push(appOptPage.get(i));
        }
        for (var i = 0; i < appOptSubpage.length; i++) {
            appOptions.push(appOptSubpage.get(i));
        }
    }
    //console.log(appOptions);
}

function nextAppOption(){
    if(appOptionsCnt < 0){
        appOptionsCnt = 0;
    }else if(appOptionsCnt >= appOptions.length-1){
        appOptionsCnt = appOptions.length-1;
    }else{
        appOptionsCnt++;
    }
    $(appOptions.get(appOptionsCnt)).focus();
}

function backAppOption(){
    if(appOptionsCnt <= 0){
        appOptionsCnt = 0;
    }else if(appOptionsCnt > appOptions.length-1){
        appOptionsCnt = appOptions.length-1;
    }else{
        appOptionsCnt--;
    }
    $(appOptions.get(appOptionsCnt)).focus();
}

function showModalLoad(message){
	if(!modalLoad.hasClass('in')){
		modalLoad.modal();
	}
	if(message == null || message == ''){
		message = 'Carregando';
	}
	console.log(message);
	$('#loadTitle', modalLoad).text(message);
}

function hideModalLoad(){
    modalLoad.modal('hide');
}

function showModalAlert(message){
	if(message == null || message == '') return;
	
	console.log(message);
	$('#alertTitle', modalAlert).text(message);
	
	if(!modalAlert.hasClass('in')){
		modalAlert.modal();
	}
	
	setAppOptions();
}

// INITIALIZE ----------------------------
//$(window).load(function() {});

$(document).ready(function(){
	var value = tizen.tvinputdevice.getSupportedKeys();
	console.log(value);
	
	tizen.tvinputdevice.registerKey('ColorF0Red');
	tizen.tvinputdevice.registerKey('ColorF1Green');
	tizen.tvinputdevice.registerKey('ColorF2Yellow');
	tizen.tvinputdevice.registerKey('ColorF3Blue');
	tizen.tvinputdevice.registerKey('ColorF3Blue');
	
	try{tizen.tvinputdevice.registerKey('Info');}catch (e) {console.log(e);}
	try{tizen.tvinputdevice.registerKey('Back');}catch (e) {console.log(e);}
	try{tizen.tvinputdevice.registerKey('Exit');}catch (e) {console.log(e);}
	try{tizen.tvinputdevice.registerKey('Search');}catch (e) {console.log(e);}
	
	for (var i = 0; i <= 9; i++) {
		tizen.tvinputdevice.registerKey(i+'');
	}
    setKeyslistener();
    
    app = $('#app');
    modalAlert = $('#modalAlert');
	modalLoad = $('#modalLoad');
	var onFinallyPref = function() {
		hideModalLoad();		
	}
    
	$('.badge-keycode').show();
	$('[data-toggle="tooltip"]').tooltip();
	$('#modalLoad').on('shown.bs.modal', function (e) {
		$('#app').addClass('blur');
	});
	$('#modalLoad').on('hidden.bs.modal', function (e) {
	    $('#app').removeClass('blur');
	});
    $('.modal-page').on('shown.bs.modal', function (e) {
        $('#app').addClass('blur');
        currentPage = $(this);
        currentSubpage = currentPage;
        setAppOptions();
    });
    $('.modal-page').on('hidden.bs.modal', function (e) {
        $('#app').removeClass('blur');
        currentPage = $('.page.active');
        currentSubpage = $('.subpage.active');
        setAppOptions();
    });

    if(resource.preferencias != null){
    	preferencias = JSON.parse(resource.preferencias);
    }else{
    	resource.preferencias = JSON.stringify(preferencias);
    }
	
    setPage('index');
    setAppOptions();
    hideModalLoad();
});
//

// LISTENERS ----------------------------
// BOTOES DA NAV
$('.navbar .btn.appOption').click(function(){
	var page = $(this).attr('data-page');
	if(page == 'index'){
		setPage(page);
		
	}else if(page == 'loteria'){
		var subpage = $(this).attr('data-subpage');
		var loteria = $(this).attr('data-lot');
		setPage(page);
		setSubpage(subpage, loteria);
		
	}else if(page == 'atalhos'){
		var showing = $(this).attr('data-showing');
		if(showing == 'false'){
			 $(this).attr('data-showing', 'true');
		     //$(this).addClass('info-focus');
		     $('.badge-keycode').show();
		}else{
			 $(this).attr('data-showing', 'false');
			 //$(this).removeClass('info-focus');
			 $('.badge-keycode').hide();
		}
		
	}else if(page == 'sair'){
		var modalSair = $('#modalSair');
	    modalSair.modal();
	    //$('#btnSim', modalSair).focus();
	}
});
//

// BOTAO SAIR
$('#modalSair #btnSim').click(function(){
	console.log('Bye!');
    tizen.application.getCurrentApplication().exit();
});
//

// BOTOES DA INDEX
$('#index .btn.appOption').click(function(){
	var page = $(this).attr('data-page');
	if(page == 'informacoes'){
		var modalInfo = $('#modalInfo');
	    modalInfo.modal();
	    
	}else if(page == 'preferencias'){
		var modalPref = $('#modalPref');
		$('#prefMega', modalPref).attr('data-val', preferencias.alertMega);
		$('#prefQuina', modalPref).attr('data-val', preferencias.alertQuina);
		$('#prefLotof', modalPref).attr('data-val', preferencias.alertLotof);
		$('#prefLotom', modalPref).attr('data-val', preferencias.alertLotom);
		
		var icon = $('#icoMega', modalPref);
		if(!preferencias.alertMega){
			icon.removeClass('fa-bell');
			icon.addClass('fa-bell-slash');
			icon.css({color:'red'});
		}else{
			icon.removeClass('fa-bell-slash');
			icon.addClass('fa-bell');
			icon.css({color:'green'});
		}
		
		icon = $('#icoQuina', modalPref);
		if(!preferencias.alertQuina){
			icon.removeClass('fa-bell');
			icon.addClass('fa-bell-slash');
			icon.css({color:'red'});
		}else{
			icon.removeClass('fa-bell-slash');
			icon.addClass('fa-bell');
			icon.css({color:'green'});
		}
		
		icon = $('#icoLotof', modalPref);
		if(!preferencias.alertLotof){
			icon.removeClass('fa-bell');
			icon.addClass('fa-bell-slash');
			icon.css({color:'red'});
		}else{
			icon.removeClass('fa-bell-slash');
			icon.addClass('fa-bell');
			icon.css({color:'green'});
		}
		
		icon = $('#icoLotom', modalPref);
		if(!preferencias.alertLotom){
			icon.removeClass('fa-bell');
			icon.addClass('fa-bell-slash');
			icon.css({color:'red'});
		}else{
			icon.removeClass('fa-bell-slash');
			icon.addClass('fa-bell');
			icon.css({color:'green'});
		}
		
		var modalPref = $('#modalPref');
		modalPref.modal();
	}
    //$('#btnFechar', modalInfo).focus();
});
//

//BOTOES MENU SUBPAGE
$('#loteria #menuLateral .btn.appOption').click(function(){
	var subpage = $(this).attr('data-subpage');
	var loteria = $('#loteria').attr('data-lot');
	setSubpage(subpage, loteria);
});
//

//BOTOES SUBPAGE RESULTADO
$('#loteria #resultado .btn.appOption').click(function(){
	var act = $(this).attr('data-act');
	var loteria = $('#loteria').attr('data-lot');
	
	if(act == 'anterior'){
		showModalLoad();
		var conc = Number($('#lotConcurso').text())-1;
		conc = conc < 1? 1 : conc;
    	getConcurso(loteria, conc,
    	    	function(resultado){ // success
    				showResultado(resultado);
    				hideModalLoad();
    	    	}, function(e){ // error
    	    		hideModalLoad();
    	    		showModalAlert(msgErroConexao);
    	    	}
    	);
	}else if(act == 'proximo'){
		showModalLoad();
		var conc = Number($('#lotConcurso').text())+1;
    	getConcurso(loteria, conc,
    	    	function(resultado){ // success
    				showResultado(resultado);
    				hideModalLoad();
    	    	}, function(e){ // error
    	    		hideModalLoad();
    	    		showModalAlert(msgErroConexao);
    	    	}
    	);
	}else if(act == 'ultimo'){
		showModalLoad();
		getUltimoConcurso(loteria,
    	    	function(resultado){ // success
    				showResultado(resultado);
    				hideModalLoad();
    	    	}, function(e){ // error
    	    		hideModalLoad();
    	    		showModalAlert(msgErroConexao);
    	    	}
    	);
	}else if(act == 'pesquisar'){
		var conc = Number($('#campoConcurso').val());
		if(conc < 1){
			$('#campoConcurso').val('');
			return;
		}
		showModalLoad();
    	getConcurso(loteria, conc,
    	    	function(resultado){ // success
    				showResultado(resultado);
    				hideModalLoad();
    	    	}, function(e){ // error
    	    		hideModalLoad();
    	    		showModalAlert(msgErroConexao);
    	    	}
    	);
	}else if(act == 'jogo'){
		var modalJogo = $('#modalJogo');
		$('table tbody', modalJogo).hide();
		$('table tbody#table'+loteria, modalJogo).show();
		modalJogo.modal();
	}
});
//

//BOTOES SUBPAGE OCORRENCIAS
$('#loteria #ocorrencias .btn.appOption').click(function(){
	var act = $(this).attr('data-act');
	var loteria = $('#loteria').attr('data-lot');
	
	if(act == 'pesquisar'){
		var jogo = '';
		var tds = $('table td', currentSubpage);
		var td = null;
		for (var i = 0; i < tds.length; i++) {
			td = $(tds[i]);
			if(td.text().length == 2){
				jogo += td.text()+'|' ;
			}
//			else{
//				$('#campoOcorrencias').focus();
//				return;
//			}
		}
		if(jogo.length == 0){
			$('#campoOcorrencias').focus();
			return;
		}
		jogo = jogo.substring(0, jogo.length-1);
		showModalLoad('Carregando ocorrências');
		getOcorrenciaJogo(loteria, jogo,
    	    	function(data){ // success
					if(data.ocorrencias.quantidade == 0){
						data = 'Nenhum concurso sorteado com estas dezenas';
					}else if(data.ocorrencias.quantidade == 1){
						data = '1 concurso sorteado com estas dezenas';
					}else{
						data = data.ocorrencias.quantidade+' concursos sorteados com estas dezenas';
					}
    				hideModalLoad();
					showModalAlert(data);
    	    	}, function(e){ // error
    	    		hideModalLoad();
    	    		showModalAlert(msgErroConexao);
    	    	}
    	);
	}
});
//

// BOTOES MODAL PREFERENCIAS
$('#modalPref .btn.appOption').click(function(){
	var modalPref = $('#modalPref');
	var dataAlert = $(this).attr('data-alert');
	var icon;
	var toAlert = $(this).attr('data-val');
		
	if(dataAlert == 'megasena'){
		icon = $('#icoMega', modalPref);
	}else if(dataAlert == 'quina'){
		icon = $('#icoQuina', modalPref);
	}else if(dataAlert == 'lotomania'){
		icon = $('#icoLotom', modalPref);
	}else if(dataAlert == 'lotofacil'){
		icon = $('#icoLotof', modalPref);
	}else{
		return;
	}
	
	if(toAlert == 'true'){
		icon.removeClass('fa-bell');
		icon.addClass('fa-bell-slash');
		icon.css({color:'red'});
		$(this).attr('data-val', 'false');
		toAlert = false;
	}else if(toAlert == 'false'){
		icon.removeClass('fa-bell-slash');
		icon.addClass('fa-bell');
		icon.css({color:'green'});
		$(this).attr('data-val', 'true');
		toAlert = true;
	}
	
	setPreferencia(dataAlert, toAlert);
});

//BOTOES SUBPAGE SUGESTOES
$('#loteria #sugestoes .btn.appOption').click(function(){
	var act = $(this).attr('data-act');
	var loteria = $('#loteria').attr('data-lot');
	var modalJogo = $('#modalJogo');
	$('table tbody', modalJogo).hide();
	var table = $('table tbody#table'+loteria, modalJogo);
	table.show();
	var tds = $('td', table);
	var descricao = $('#descricao', modalJogo);
	descricao.show();
	var dezenas = 0;
	var range = 0;
	var limite = 5;
	var ate = 0;
	
	if(loteria == "lotofacil"){
		dezenas = 15;
		range = 20;
		ate = 25;
	}else if(loteria == "lotomania"){
		dezenas = 50;
		range = 75;
		ate = 99;
	}else if(loteria == "megasena"){
		dezenas = 6;
		range = 24;
		limite = 6;
		ate = 60;
	}else if(loteria == "quina"){
		dezenas = 5;
		range = 20;
		ate = 80;
	}

	if(act == 'jogo_rapido'){
		showModalLoad('Carregando jogo rápido');
		var jogoRapido = generateDezenas(dezenas, ate);
		for (var i = 0; i < tds.length; i++) {
			$(tds.get(i)).text(jogoRapido[i].dezena);
		}
		hideModalLoad();
		descricao.text('Jogo rápido');
		modalJogo.modal();
		
	}else if(act == 'mais_sorteadas'){
		showModalLoad('Carregando mais sorteadas');
		getOcorrenciaDezenas(loteria, 
				function(data){
					data = shuffleArray(data.ocorrencias.slice(0, range)).slice(0, dezenas).sort(sorterDezenas);
					for (var i = 0; i < data.length; i++) {
						$(tds.get(i)).text((jQuery.type(data) === "array"? data[i].dezena : data[i]));
					}
					hideModalLoad();
					descricao.text('Dezenas mais sorteadas');
					modalJogo.modal();
				},
				function(e){
					hideModalLoad();
    	    		showModalAlert(msgErroConexao);
				}
			);
		
	}else if(act == 'menos_sorteadas'){
		showModalLoad('Carregando menos sorteadas');
		getOcorrenciaDezenas(loteria, 
				function(data){
					data = shuffleArray(data.ocorrencias.slice((data.ocorrencias.length-range), data.ocorrencias.length)).slice(0, dezenas).sort(sorterDezenas);
					for (var i = 0; i < data.length; i++) {
						$(tds.get(i)).text((jQuery.type(data) === "array"? data[i].dezena : data[i]));
					}
					hideModalLoad();
					descricao.text('Dezenas menos sorteadas');
					modalJogo.modal();
				},
				function(e){
					hideModalLoad();
    	    		showModalAlert(msgErroConexao);
				}
			);
		
	}else if(act == 'data_hoje'){
		var hoje = new Date();
		showModalLoad('Carregando data de hoje: '+hoje.getDate());
		getOcorrenciaDia(loteria, hoje.getDate(), 
				function(data){
					data = shuffleArray(data.ocorrencias.slice(0, range)).slice(0, dezenas).sort(sorterDezenas);
					for (var i = 0; i < data.length; i++) {
						$(tds.get(i)).text((jQuery.type(data) === "array"? data[i].dezena : data[i]));
					}
					hideModalLoad();
					descricao.text('Baseado na data de hoje: '+hoje.getDate());
					modalJogo.modal();
				},
				function(e){
					hideModalLoad();
    	    		showModalAlert(msgErroConexao);
				}
			);
		
	}else if(act == 'por_regiao'){
		var modalRegioes = $('#modalRegioes');
		modalRegioes.attr('data-lot', loteria);
		modalRegioes.attr('data-dez', dezenas);
		modalRegioes.attr('data-ran', range);
		modalRegioes.attr('data-ate', ate);
		$('img', modalRegioes).attr('src', 'images/br_regions_'+loteria+'.svg');
		modalRegioes.modal();
		setAppOptions();
	}
});
//

//BOTOES MODAL REGIOES
$('#modalRegioes .btn-loteria.appOption').click(function(){
	var modalRegioes = $('#modalRegioes');
	var loteria = modalRegioes.attr('data-lot');
	var dezenas = modalRegioes.attr('data-dez');
	var range = modalRegioes.attr('data-ran');
	var ate = modalRegioes.attr('data-ate');
	var dataReg = $(this).attr('data-reg');
	var modalJogo = $('#modalJogo');
	var table = $('table tbody#table'+loteria, modalJogo);
	var tds = $('td', table);
	var descricao = $('#descricao', modalJogo);

	modalRegioes.modal('hide');
	showModalLoad('Carregando região: '+regiaoExtenso(dataReg));
	getOcorrenciaRegiao(loteria, dataReg, 
			function(data){
				data = shuffleArray(data.ocorrencias.slice(0, range)).slice(0, dezenas).sort(sorterDezenas);
				for (var i = 0; i < data.length; i++) {
					$(tds.get(i)).text((jQuery.type(data) === "array"? data[i].dezena : data[i]));
				}
				hideModalLoad();
				descricao.text('Baseado em ganhadores da região: '+regiaoExtenso(dataReg));
				modalJogo.modal();
			},
			function(e){
				hideModalLoad();
	    		showModalAlert(msgErroConexao);
			}
		);
});

// CAMPO DE BUSCA DE CONCURSO
$('#campoConcurso').focusin(function(){
	$(this).blur();
	$(this).addClass('focus');
	app.addClass('keyboard-concurso');
	app.attr('data-input', 'campoConcurso');
	app.attr('data-enter', 'btnPesquisar');
});
//

//CAMPO DE BUSCA DE OCORRENCIAS
$('#campoOcorrencias').focusin(function(){
	$(this).blur();
	$(this).addClass('focus');
	app.addClass('keyboard-ocorrencias');
	app.attr('data-input', 'campoOcorrencias');
	app.attr('data-enter', 'btnOcorrencias');
});
//























