var APPID = tizen.application.getCurrentApplication().appInfo.id;
var daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

function createAlarme(loteria) {
	var date = new Date();
	date.setHours(18, 0, 0, 0);
	var days = [];
	if(loteria == 'megasena'){
		days.push(daysOfWeek[2]);
		days.push(daysOfWeek[5]);
		
	}else if(loteria == 'quina'){
		days.push(daysOfWeek[0]);
		days.push(daysOfWeek[1]);
		days.push(daysOfWeek[2]);
		days.push(daysOfWeek[3]);
		days.push(daysOfWeek[4]);
		days.push(daysOfWeek[5]);
		
	}else if(loteria == 'lotofacil'){
		days.push(daysOfWeek[0]);
		days.push(daysOfWeek[2]);
		days.push(daysOfWeek[4]);
		
	}else if(loteria == 'lotomania'){
		days.push(daysOfWeek[2]);
		days.push(daysOfWeek[5]);
		
	}else{
		return null;
	}
	
	var alarm = new tizen.AlarmAbsolute(date, days);
	tizen.alarm.add(alarm, APPID);
	console.log("Alarm to "+loteria+" added with id: " + alarm.id);
	var date = alarm.getNextScheduledDate();
	console.log("Next scheduled time is " + date);
	console.log("Current is: "+new Date());
	
	listAlarms();
	
	return alarm.id;
}

function removeAlarme(alarmId) {
	tizen.alarm.remove(alarmId);
	
	listAlarms();
}

function listAlarms(){
	console.log("Alarm List --------");
	var alarms = tizen.alarm.getAll();
	for (var i = 0; i < alarms.length; i++) {
		console.log("ID: "+ alarms[i].id);
	}
}
