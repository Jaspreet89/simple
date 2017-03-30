
$(document).ready(function(){

	var hc = new HomeController();
	var av = new AccountValidator();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
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

// customize the account settings form //
	$('#account-form h2').text('Konto-Einstellungen');
	$('#account-form #sub1').text('Ihre momentanen Einstellungen zu diesem Konto.');
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('Delete');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Update');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h4').text('Konto löschen');
	$('.modal-confirm .modal-body p').html('Möchten Sie sicher ihr Konto löschen?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');

});
