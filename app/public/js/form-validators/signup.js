
$(document).ready(function(){
	
	var av = new AccountValidator();
	var sc = new SignupController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    av.showInvalidUserName();
			}
		}
	});
	$('#name-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h2').text('Signup');
	$('#account-form #sub1').text('Bitte füllen Sie das folgende Formular aus');
	$('#account-form #sub2').text('Wählen Sie ihren Benutzernamen und das Passwort');
	$('#account-form-btn1').html('Abbrechen');
	$('#account-form-btn2').html('Abschicken');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Konto wurde erstellt!');
	$('.modal-alert .modal-body p').html('Ihr Konto wurde erstellt.</br>Klicken Sie auf OK um zur Anmeldeseite zu gelangen.');

});