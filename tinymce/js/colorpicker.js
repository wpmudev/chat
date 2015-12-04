(function ($) {
	$(document).ready(function () {
		$('#chat_background_color_panel').farbtastic('#chat_background_color').hide();
		$('#chat_date_color_panel').farbtastic('#chat_date_color').hide();
		$('#chat_name_color_panel').farbtastic('#chat_name_color').hide();
		
		$("#chat_background_color").focus(function() {
			$("#"+$(this).attr('id')+"_panel").slideDown();
		});
		
		$("#chat_background_color").blur(function() {
			$("#"+$(this).attr('id')+"_panel").slideUp();
		});
	});
})(jQuery);
