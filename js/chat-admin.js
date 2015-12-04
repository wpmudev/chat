/**
 * Chat plugin admin javascript
 * 
 * @author	S H Mohanjith <moha@mohanjith.net>
 * @since	1.0.1
 */

(function ($) {
	$(document).ready(function () {
		$('#chat_tab_pane').tabs({cookie: { name: 'chat_tab_pane', expires: 30 } });
		
		$('#chat_background_color_panel').farbtastic('#chat_background_color').hide();
		$('#chat_date_color_panel').farbtastic('#chat_date_color').hide();
		$('#chat_name_color_panel').farbtastic('#chat_name_color').hide();
		$('#chat_moderator_name_color_panel').farbtastic('#chat_moderator_name_color').hide();
		$('#chat_text_color_panel').farbtastic('#chat_text_color').hide();
		
		$('#chat_border_color_1_panel').farbtastic('#chat_border_color_1').hide();
		$('#chat_background_color_1_panel').farbtastic('#chat_background_color_1').hide();
		$('#chat_date_color_1_panel').farbtastic('#chat_date_color_1').hide();
		$('#chat_name_color_1_panel').farbtastic('#chat_name_color_1').hide();
		$('#chat_moderator_name_color_1_panel').farbtastic('#chat_moderator_name_color_1').hide();
		$('#chat_text_color_1_panel').farbtastic('#chat_text_color_1').hide();
		
		$("input.color").focus(function() {
			$("#"+$(this).attr('id')+"_panel").slideDown();
		});
		
		$("input.color").blur(function() {
			$("#"+$(this).attr('id')+"_panel").slideUp();
		});
	});
})(jQuery);
