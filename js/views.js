// DEPENDE DE MAIN.JS
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
	$('.modal').on('show.bs.modal', function (e) {
  		$('#app').addClass('blur');
	});
	$('.modal').on('hidden.bs.modal', function (e) {
  		$('#app').removeClass('blur');
	});
});

$('#btnAtalhos').click(function(){
	var showing = $(this).attr('data-showing');
	if(showing == 'false'){
		$(this).attr('data-showing', 'true');
		$(this).addClass('info-focus');
		$('.badge-keycode').show();
	}else{
		$(this).attr('data-showing', 'false');
		$(this).removeClass('info-focus');
		$('.badge-keycode').hide();
	}
});

$('#btnSair').click(function(){
	var modalSair = $('#modalSair');
	modalSair.modal();
	$('#btnSim', modalSair).focus();
});
$('#modalSair #btnSim').click(function(){
	tizen.application.getCurrentApplication().exit();
});