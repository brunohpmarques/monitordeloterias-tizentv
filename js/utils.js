function formatarData(data){
	data = data.split(' ')[0];
	var splits = data.split('-');
	return splits[2]+'/'+splits[1]+'/'+splits[0];
}

function formatarReal(valor){
	   var str = valor+'';
	   if(str === '' || parseFloat(valor) <= 0) return '0,00';
	   str = parseFloat(str.replace(/[^0-9\.]+/g,''));
	   return 'R$'+str.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

function regiaoExtenso(siglaRegiao){
	if(siglaRegiao == 'N'){
		return 'Norte';
	}else if(siglaRegiao == 'NE'){
		return 'Nordeste';
	}else if(siglaRegiao == 'CO'){
		return 'Centro-Oeste';
	}else if(siglaRegiao == 'SE'){
		return 'Sudeste';
	}else if(siglaRegiao == 'S'){
		return 'Sul';
	}
	return '';
}

function generateDezenas(dezenas, ate){
	var dez = 0;
	var array = [];
	for (var i=0; i<dezenas; i++) {
		dez = Math.floor(Math.random() * ate) + (ate == 99? 0 : 1);
		if(containsDezena(dez, array)){
			i--;
			continue;
		}
		array.push({dezena: dez});
	}
	return array.sort(sorterDezenas);
}

function containsDezena(dez, array) {
    for (var i = 0; i < array.length; i++) {
        if(dez == array[i].dezena){
        	return true;
        }
    }
    return false;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function sorterDezenas(a, b) {
    if(a.dezena > b.dezena){
    	return 1;
    }else if(a.dezena < b.dezena){
    	return -1;
    }
    return 0;
};