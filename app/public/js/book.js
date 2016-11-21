var Spreis = ['19.99', '24.99', '24.99', '29.99', '69.99', '12.99', '199.99'];
var Mpreis = ['28.99', '33.99', '33.99', '39.99', '69.99', '14.99', '279.99'];
var Lpreis = ['32.99', '36.99', '36.99', '49.99', '79.99', '16.99', '356.99'];
var XLpreis = ['36.99', '42.99', '42.99', '59.99', '79.99', '18.99', '399.99'];
var XXLpreis = ['40.99', '46.99', '46.99', '59.99', '79.99', '19.99', '449.99'];
function hideSubModels() {
	$('.submodel').hide();
}
function hideCheckboxes() {
	$('.optionen').hide();
}

function first() {
	$(".optionen").val($(".optionen option:first").val());
}
function sort(id) {

	var my_options = $(id + "  option");
	var selected = $(id).val();

	my_options.sort(function (a, b) {
		if (a.text > b.text)
			return 1;
		if (a.text < b.text)
			return -1;
		return 0
	})

	$(id).empty().append(my_options);
	$(id).val(selected);

}
$(function () {
	$('#datepicker').datepicker({
		prevText : '&#x3c;zurück',
		prevStatus : '',
		prevJumpText : '&#x3c;&#x3c;',
		prevJumpStatus : '',
		nextText : 'Vor&#x3e;',
		nextStatus : '',
		nextJumpText : '&#x3e;&#x3e;',
		nextJumpStatus : '',
		currentText : 'heute',
		currentStatus : '',
		todayText : 'heute',
		todayStatus : '',
		clearText : '-',
		clearStatus : '',
		closeText : 'schließen',
		closeStatus : '',
		monthNames : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
			'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
		monthNamesShort : ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
			'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
		dayNames : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
		dayNamesShort : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
		dayNamesMin : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
		minDate : new Date(),
		showMonthAfterYear : false,
		firstDay : 1,
		dateFormat : 'd.MM.yy'
	});

});

function endprice() {
	if (gesamtVal < 0) {
		gesamtVal = 0;
	};

	$('#_gesamt').text((gesamtVal).toFixed(2) + "€");
	$('.outputPrice').text((gesamtVal).toFixed(2) + "€");
}

var UserData = {};

function fetch() {
	UserData.brand = $("#brand option:selected").text();
	UserData.model = $(".modell ._"+UserData.brand +" option:selected").text();

	UserData.options = [];
	$('input[name="anzeige"]:checked').each(function () {
		var klammer = $(this).parent().find('label').text().indexOf("(") - 1;
		UserData.options.push($(this).parent().find('label').text().substr(0, klammer));
	});
	UserData.preis = $("#_gesamt").text();
	UserData.farbe = $("#farbe").val();
	UserData.kennzeichen = $("#kennzeichen").val();
	UserData.einsatzort = $("#ort").val();
	UserData.plz = $("#plz").val();
	UserData.strasse = $("#strasse").val();
	UserData.hausnr = $("#hausnr").val();
	UserData.telefon = $("#telefon").val();
	UserData.anmerkung = $("#anmerkung").val();
	UserData.abstellplatz = $("input[name='abstellplatz']:checked").val();
	UserData.datum = $("#datepicker").val();
	UserData.zeit = $("#zeit").val();
	UserData.vorname = $("#vorname").val();
	UserData.nachname = $("#nachname").val();
	UserData.firma = $("#firma").val();
	UserData.email = $("#email").val();
	UserData.zahlungsart = $("#zahlungsart option:selected").text();
	$.post('/book',UserData, "json").success(function(response){
		if(response=="ok"){
			SuccessMsg('we have recieved your request!. Will Contact you soon!');
		}
	});
}

function load(Data) {
	hideSubModels();
	var option;
	$('#brand option').each(function () {
		if ($(this).text() == Data.brand) {
			option = this;
			option.selected = true;
			return false;
		}
	});
	var option;

	$('.modell option').each(function () {
		if ($(this).text() == Data.model) {
			option = this;
			option.selected = true;
			SetPries($(this).val());

		}
	});
	$('.modell').show();
	var _class = "_" + Data.brand;
	$('.' + _class).show();
	$("#farbe").val(Data.farbe);
	$("#kennzeichen").val(Data.kennzeichen);
	$("#ort").val(Data.einsatzort);
	$("#plz").val(Data.plz);
	$("#strasse").val(Data.strasse);
	$("#hausnr").val(Data.hausnr);
	$("#telefon").val(Data.telefon);
	$("#anmerkung").val(Data.anmerkung);
	//$("input[name='abstellplatz']:selected").val(Data.abstellplatz);
	$("#datepicker").val(Data.datum);
	$("#zeit").val(Data.zeit);
	$("#vorname").val(Data.vorname);
	$("#nachname").val(Data.nachname);
	$("#firma").val(Data.firma);
	$("#email").val(Data.email);
	$("#_gesamt").text(Data.preis);
	$(".outputPrice").text(Data.preis);
	$('.optionen').show();

	/*UserData.options = [];
	 $('input[name="anzeige"]:checked').each(function () {
	 var klammer = $(this).parent().find('label').text().indexOf("(") - 1;
	 UserData.options.push($(this).parent().find('label').text().substr(0, klammer));*/


	$("input[type='radio']").each(function () {
		if($(this).val() === Data.abstellplatz){
			$(this).prop('checked', true);
		}
	});


	$("input[name='anzeige']").each(function () {

		if(Data.options.indexOf($(this).val())>-1){
			//$(this).prop('checked', true);
			$(this).trigger('click');
		}

	});


}
function test() {
	alert("test");
}
function sort(id) {

	var my_options = $(id + "  option");
	var selected = $(id).val();

	my_options.sort(function (a, b) {
		if (a.text > b.text)
			return 1;
		if (a.text < b.text)
			return -1;
		return 0
	})

	$(id).empty().append(my_options);
	$(id).val(selected);
}
function SetPries(size){
	switch (size) {
		case "S":
			$('#_a').text(Spreis[0]);
			$('#_b').text(Spreis[1]);
			$('#_c').text(Spreis[2]);
			$('#_d').text(Spreis[3]);
			$('#_e').text(Spreis[4]);
			$('#_f').text(Spreis[5]);
			$('#_g').text(Spreis[6]);

			break;
		case "M":
			$('#_a').text(Mpreis[0]);
			$('#_b').text(Mpreis[1]);
			$('#_c').text(Mpreis[2]);
			$('#_d').text(Mpreis[3]);
			$('#_e').text(Mpreis[4]);
			$('#_f').text(Mpreis[5]);
			$('#_g').text(Mpreis[6]);
			break;
		case "L":
			$('#_a').text(Lpreis[0]);
			$('#_b').text(Lpreis[1]);
			$('#_c').text(Lpreis[2]);
			$('#_d').text(Lpreis[3]);
			$('#_e').text(Lpreis[4]);
			$('#_f').text(Lpreis[5]);
			$('#_g').text(Lpreis[6]);
			break;
		case "XL":
			$('#_a').text(XLpreis[0]);
			$('#_b').text(XLpreis[1]);
			$('#_c').text(XLpreis[2]);
			$('#_d').text(XLpreis[3]);
			$('#_e').text(XLpreis[4]);
			$('#_f').text(XLpreis[5]);
			$('#_g').text(XLpreis[6]);
			break;
		case "XXL":
			$('#_a').text(XXLpreis[0]);
			$('#_b').text(XXLpreis[1]);
			$('#_c').text(XXLpreis[2]);
			$('#_d').text(XXLpreis[3]);
			$('#_e').text(XXLpreis[4]);
			$('#_f').text(XXLpreis[5]);
			$('#_g').text(XXLpreis[6]);
			break;

	}
}
var gesamtVal = 0;
$(document).ready(function () {

if($('#userId').val()!=""){
		$('#loadBtn').show();
		$('#loadBtn').click(function () {
			load(JSON.parse($('#userdata').val()));
		});

}


	$('.modell').hide();


	hideSubModels();
	hideCheckboxes();

	$("#brand").change(function () { //If brand is changed, show blank modellist
		hideSubModels();
		hideCheckboxes();
		$("input[name='anzeige']").prop("checked", false);

		var _class = $(this).val();
		if (_class == "") {
			$('.modell').hide();
		} else {
			$('.modell').show();

			$('.' + _class).show();
			sort('.' + _class);
			$('.' + _class).change(function () { // if modell is changed, check size, check and calculate new prices

				$("input[name='anzeige']").prop("checked", false);
				$('.optionen').show();
				gesamtVal = 0;

				var size = $("." + _class + " option:selected").val();
				if(size==""){hideCheckboxes();}else{SetPries(size);}


			});

			$('.' + _class).val($('.' + _class + ' option:first').val());
		}
	});

	$("input[name='anzeige']").click(function () {

		var id = $(this)[0].id;

		var x = parseFloat($('#' + id).parent().find('#_' + id).text());

		if (this.checked) {

			gesamtVal = gesamtVal + x;

		} else {

			gesamtVal = gesamtVal - x;
		}

		endprice()
	});
	$('#c').click(function () {
		var add = 0;
		var minus = 0;
		if (this.checked) {

			if ($('#a').prop('checked') == true) {
				add -= parseFloat($("#_a").text());
			}
			if ($('#b').prop('checked') == true) {
				add -= parseFloat($("#_b").text());
			}
			$("#a").prop("checked", true).prop("disabled", true);
			$("#b").prop("checked", true).prop("disabled", true);
			add += parseFloat($("#_a").text());
			add += parseFloat($("#_b").text());
			//	add += parseFloat($("#_c").text());
			//	alert(add);
			gesamtVal = gesamtVal + add;
			endprice();

		} else {
			$("#a").prop("checked", false).prop("disabled", false);
			$("#b").prop("checked", false).prop("disabled", false);

			add += parseFloat($("#_a").text());
			add += parseFloat($("#_b").text());
			//	add += parseFloat($("#_c").text());
			//	alert(add);
			gesamtVal = gesamtVal - add;
			endprice();
		}

	});

});