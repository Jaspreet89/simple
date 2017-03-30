
$(document).ready(function(){
	
	var rv = new ResetValidator();
	
	$('#set-password-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){;
			rv.hideAlert();
			if (rv.validatePassword($('#pass-tf').val()) == false){
				return false;
			} 	else{
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			rv.showSuccess("Ihr Passwort wurde zurückgesetzt.");
			setTimeout(function(){ window.location.href = '/anmeldung'; }, 3000);
		},
		error : function(){
			rv.showAlert("Aktion fehlgeschlagen. Bitte erneut versuchen.");
		}
	});

	$('#set-password').modal('show');
	$('#set-password').on('shown', function(){ $('#pass-tf').focus(); })

});