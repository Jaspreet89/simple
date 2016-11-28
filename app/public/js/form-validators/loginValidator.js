
function LoginValidator()
{
// bind a simple alert window to this controller to display any errors //
	this.loginErrors = $('.modal-alert');
	
	this.showLoginError = function(t, m)
	{
		$('.modal-alert .modal-header h4').text(t);
		$('.modal-alert .modal-body').html(m);
		this.loginErrors.modal('show');
	}
}

LoginValidator.prototype.validateForm = function()
{
	if ($('#user_tf').val() == ''){
		this.showLoginError('Whoops!', 'Bitte geben Sie einen Benutzernamen ein.');
		return false;
	}	else if ($('#pass_tf').val() == ''){
		this.showLoginError('Whoops!', 'Bitte geben Sie ein Passwort ein.');
		return false;
	}	else{
		return true;
	}
}