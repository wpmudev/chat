/**
 * Chat plugin javascript
 * 
 * @todo	Make this more OO when we have time
 * 
 * @author	S H Mohanjith <moha@mohanjith.net>
 * @since	1.0.1
 */

var chat_localized;

if (chat_localized) {
    var instanse = false;
    var logging_out = false;
    var mes;
    var file;
    var postid;
    var currentContent = [];
    var lastCheck = [];
    var last_mid = [];
    var chat_refresh_timer = [];
    var mids = [];
    var chat;
    var pingSound;
    var lastUpdate = [];
    
    var name = chat_localized["name"];
    var vip = chat_localized["vip"];
    var sounds = chat_localized["sounds"];
    var post_id = chat_localized["post_id"];
    
    function Chat() {
	this.update = updateChat;
	this.send = sendChat;
	this.setup = setupChat;
	this.clear = clearChat;
	this.archive = archiveChat;
    }
    
    function updateChat(sounds){
	if(!instanse){
	    jQuery('.chat-post-id').each(function () {
		var instanse = true;
		var pid = jQuery(this).val();
		if (!lastCheck[pid]) {
		    lastCheck[pid] = 0;
		    last_mid[pid] = 0;
		    lastUpdate[pid] = new Date().getTime();
		}
		if (!(pid == 1 && jQuery('#chat-block-site').hasClass('closed'))) {
		    jQuery.ajax({
			type: "POST",
			url: chat_localized["url"],
			data: {  
			    'function': 'update',
			    'cid': pid,
			    'file': file,
			    'action': 'chatProcess',
			    'avatar': chat_localized["avatar_"+pid],
			    'emoticons': chat_localized["avatar_"+pid],
			    'date_color': chat_localized["date_color_"+pid],
			    'name_color': chat_localized["name_color_"+pid],
			    'moderator_name_color': chat_localized["moderator_name_color_"+pid],
			    'text_color': chat_localized["text_color_"+pid],
			    'date_show': chat_localized["date_show_"+pid],
			    'time_show': chat_localized["time_show_"+pid],
			    'since': lastCheck[pid],
			    'since_id': last_mid[pid],
			    'moderator_roles': chat_localized["moderator_roles_"+pid]
			},
			dataType: "json",
			success:
			    function(data){
				if(data && data.text){
				    var updateContent = '';
				    for (i in data.text) {
					updateContent = updateContent + "<p>"+data.text[i]+"</p>";
					last_mid[pid] = i;
				    }
				    
				    lastCheck[pid] = Math.max(data.time, lastCheck[pid]);
				    
				    /*if (data.text.length > 0) {
					jQuery('#chat-area-'+pid).animate({ scrollTop: jQuery('#chat-area-'+pid).attr("scrollHeight") }, 2000);
				    }
				    if ( sounds !== 'disabled' && chat_localized['sound_'+pid] !== 'disabled' && pingSound ) {
					pingSound.play('notify');
				    }*/
				    
				    if ( currentContent[pid] !== updateContent ) {
					if ( updateContent !== '' ) {
					    jQuery('#chat-area-'+pid).append(jQuery(updateContent.replace(currentContent[pid], '')));
					    currentContent[pid] = updateContent;
						
						var container 			= jQuery('#chat-area-'+pid);						
						var row					= jQuery('div.row', container).last();
						if (row.length) {
							var r_position			= row.position();
							var c_scrollTop 		= container.scrollTop()+r_position.top;

							jQuery('#chat-area-'+pid).animate({ scrollTop: c_scrollTop }, 1000);
						}
					    //jQuery('#chat-area-'+pid).animate({ scrollTop: jQuery('#chat-area-'+pid).attr("scrollHeight") }, 2000);
					
					    if ( sounds !== 'disabled' && chat_localized['sound_'+pid] !== 'disabled' && pingSound ) {
						pingSound.play('notify');
					    }
					}
				    }
				}
				instanse = false;
				lastUpdate[pid] = new Date().getTime();
			    }
			}
		    );
		    
		    if (new Date().getTime() > lastUpdate[pid]+(chat_localized["interval"]*1000)*60) {
			jQuery('#chat-send-'+pid).attr('disabled', true);
		    } else {
			jQuery('#chat-send-'+pid).attr('disabled', false);
		    }
		}
	    });
	} else {
	    //setTimeout(updateChat, 1500);
	}
    }
    
    function sendChat(pid, message, name, vip, sounds, type)
    {
	message = base64_encode(jQuery.trim(message));
	name = base64_encode(jQuery.trim(name));
	jQuery.ajax({
		       type: "POST",
		       url: chat_localized["url"],
		       data: {  
					    'function': 'send',
					    'cid': pid,
					    'message': message,
					    'name': name,
					    'type': type,
					    'vip': vip,
					    'file': file,
					    'action': 'chatProcess',
					    'moderator_roles': chat_localized["moderator_roles_"+pid]
				     },
		       dataType: "json",
		       success: function(data){
			    updateChat(sounds);
		       }
		    });
    }
    
    function clearChat(pid)
    {
	jQuery.ajax({
		       type: "POST",
		       url: chat_localized["url"],
		       data: {  
					    'cid': pid,
					    'vip': vip,
					    'file': file,
					    'action': 'chatClear',
					    'since': lastCheck[pid]
				     },
		       dataType: "json",
		       success: function(data){
					    window.location.reload();
		       }
		    });
    }
    
    function archiveChat(pid)
    {
	jQuery.ajax({
		       type: "POST",
		       url: chat_localized["url"],
		       data: {  
					    'cid': pid,
					    'vip': vip,
					    'file': file,
					    'action': 'chatArchive',
					    'since': lastCheck[pid]
				     },
		       dataType: "json",
		       success: function(data){
					     window.location.reload();
		       }
		    });
    }
    
    function setupChat(pid, sounds)
    {
	postid = pid;
	chat_refresh_timer[pid] = setInterval("updateChat(sounds)",chat_localized["interval"]*1000);
	updateChat(sounds);
    }
    
    /**
     * Chat setup
     */
    
    name = name.replace(/(<([^>]+)>)/ig,"");
    
    chat = new Chat();
    chat.setup(post_id, sounds);
    
    (function($) {
	    $(document).ready(function() {
		    // Sound manager
		    soundManager.url = chat_localized.plugin_url + 'swf/';
		    soundManager.onload = function() {
			pingSound = soundManager.createSound({
			    id: 'ping',
			    url: chat_localized.plugin_url + '/audio/ping.mp3',
			    volume: 100
			});
		    };
		    
		    if (!$('#chat-block-site').hasClass('closed') && $('#chat-box-1').height() > $(window).height()) {
			    $('#chat-block-inner').height($(window).height()-50);
			    if ($('#chat-block-site').hasClass('free-width')) {
				width = Math.max(425, $('#chat-box-1').width());
			    } else {
				width = $('#chat-box-1').width();
			    }
			    $('#chat-block-site').width(width+15);
		    } else {
			if ($('#chat-block-inner .chat-login-wrap').hasClass('chat-login-wrap')) {
			    $('#chat-block-inner').height($('#chat-box-1').height()+50);
			} else {
			    $('#chat-block-inner').height($('#chat-box-1').height());
			}
		    }
		    
		    $(window).resize(function () {
			if (!$('#chat-block-site').hasClass('closed')) {
			    if ($('#chat-box-1').height() > $(window).height()) {
				$('#chat-block-inner').height($(window).height()-50);
				if ($('#chat-block-site').hasClass('free-width')) {
				    width = Math.max(425, $('#chat-box-1').width());
				} else {
				    width = $('#chat-box-1').width();
				}
				$('#chat-block-site').width(width+15);
			    }
		    
			    if ($(window).height() > $('#chat-box-1').height()) {
				$('#chat-block-inner').height($('#chat-box-1').height()+5);
				if ($('#chat-block-site').hasClass('free-width')) {
				    width = Math.max(425, $('#chat-box-1').width());
				} else {
				    width = $('#chat-box-1').width();
				}
				$('#chat-block-site').width(width);
			    }
			}
			$('.chat-send').each(function () {
			    $(this).width($(this).closest('.chat-send-wrap').width()-12);
			})
		    });
    
		    $(".chat-send").keydown(function(event) {
			var key = event.which;
			if (key >= 33) {
			    var maxLength = 2000;
			    var length = this.value.length;
			    
			    if (length >= maxLength) {
				event.preventDefault();
			    }
			}
		    });
		    
		    $('.chat-send').keyup(function(e) {
			if (e.keyCode == 13) {
			    var text = $(this).val();
			    var maxLength = 2000;
			    var length = text.length;
			    
			    if (length <= maxLength + 1) {
				cid = $(this).closest('form').find('.chat-post-id').val();
			        chat.send(cid, text, chat_localized['name_'+cid], vip, chat_localized['sound_'+cid], chat_localized['type_'+cid]);
				$(this).val("");
			    } else {
			        $(this).val(text.substring(0, maxLength));
			    }
		        }
		    });
		      
		    $('.chat-clear').click(function(e) {
			chat.clear($(this).closest('form').find('.chat-post-id').val());
		        $(this).attr("disabled", "disabled");
		        $(this).val(chat_localized.please_wait);
		    });
			
		    $('.chat-archive').click(function(e) {
			chat.archive($(this).closest('form').find('.chat-post-id').val());
			$(this).attr("disabled", "disabled");
			$(this).val(chat_localized.please_wait);
		    });
			
		    $('.chat-clear').attr("disabled", false);
		    $('.chat-archive').attr("disabled", false);
		    
		    $('div.chat-emoticons-list img').click(function() {
			cid = $(this).closest('div').attr('id').replace(/chat\-emoticons\-list\-/, '');
			$('#chat-send-'+cid).val($('#chat-send-'+cid).val()+' '+$(this).attr('alt')).focus();
		    });
		    
		    $('#chat-block-header').click(function() {
			    if ($('#chat-toggle-button').attr('alt') == '-') {
				    $('#chat-block-site').addClass('closed');
				    $('#chat-toggle-button').attr('alt', '+');
				    $('#chat-toggle-button').attr('src', chat_localized.maximize_button);
				    $('#chat-toggle-button').attr('title', chat_localized.maximize);
				    $.cookie('chat_site_wide_state_104', 'closed', { expires: 7, path: '/'});
				    
			    } else {
				    $('#chat-block-site').removeClass('closed');
				    $('#chat-toggle-button').attr('alt', '-');
				    $('#chat-toggle-button').attr('src', chat_localized.minimize_button);
				    $('#chat-toggle-button').attr('title', chat_localized.minimize);
				    $.cookie('chat_site_wide_state_104', 'open', { expires: 7, path: '/'});
			    }
			    $(window).resize();
		    });
			    
		    $('form.chat-login').submit(function () {
			    if ($.cookie('chat_stateless_user_type_104') && $.cookie('chat_stateless_user_type_104').match(',')) {
				    login_options = $.cookie('chat_stateless_user_type_104').split(',');
				    if (!$.cookie('chat_stateless_user_type_104').match('public_user')) {
					    login_options.push('public_user');
				    }
			    } else {
				    login_options = [$.cookie('chat_stateless_user_type_104'), 'public_user'];
			    }
			    $.cookie('chat_stateless_user_type_104', login_options.join(','), { expires: 7, path: '/'});
			    $.cookie('chat_stateless_user_name_public_user', $(this).find('input.chat-login-name').val(), { expires: 7, path: '/'});
			    $.cookie('chat_stateless_user_image_public_user', $(this).find('input.chat-login-email').val(),{ expires: 7, path: '/'});
				    
			    window.location.reload();
			    return false;
		    });
		    
		    if ($.cookie('chat_site_wide_state_104') == 'open') {
			    $('#chat-block-site').removeClass('closed');
			    $('#chat-toggle-button').attr('alt', '-');
			    $('#chat-toggle-button').attr('src', chat_localized.minimize_button);
			    $('#chat-toggle-button').attr('title', chat_localized.minimize);
			    $.cookie('chat_site_wide_state_104', 'open', { expires: 7, path: '/'});
		    }
		    
		    $(window).resize();
	    });
    })(jQuery);
    
    
    (function($) {
	if (chat_localized['twitter_active']) {
	    twttr.anywhere(function (T) {
		    if (T.isConnected()) {
			    $(".chat-twitter-signin-btn").append('<button class="chat-twitter-signout-btn" type="button">'+chat_localized.twitter_text_sign_out+'</button>');
			    $(".chat-twitter-signout-btn").bind("click", function () {
				    twttr.anywhere.signOut();
			    });
			    
			    if ($.cookie('chat_stateless_user_type_104') && $.cookie('chat_stateless_user_type_104').match(',')) {
				    login_options = $.cookie('chat_stateless_user_type_104').split(',')
				    if (!$.cookie('chat_stateless_user_type_104').match('twitter')) {
					    login_options.push('twitter');
				    }
			    } else {
				    login_options = [$.cookie('chat_stateless_user_type_104'), 'twitter'];
			    }
    
			    $.cookie('chat_stateless_user_type_104', login_options.join(','), { expires: 7, path: '/'});
			    $.cookie('chat_stateless_user_name_twitter', T.currentUser.data('name'), { expires: 7, path: '/'});
			    $.cookie('chat_stateless_user_image_twitter', T.currentUser.data('profile_image_url'), { expires: 7, path: '/'});
		    } else {
			    $(".chat-twitter-signin-btn").each(function () {
				    T("#"+$(this).attr('id')).connectButton({size: "large"});
			    });
		    }
		    
		    T.bind("authComplete", function (e, user) {
			    if ($.cookie('chat_stateless_user_type_104') && $.cookie('chat_stateless_user_type_104').match(',')) {
				    login_options = $.cookie('chat_stateless_user_type_104').split(',');
				    if (!$.cookie('chat_stateless_user_type_104').match('twitter')) {
					    login_options.push('twitter');
				    }
			    } else {
				    login_options = [$.cookie('chat_stateless_user_type_104'), 'twitter'];
			    }
    
			    $.cookie('chat_stateless_user_type_104', login_options.join(','), { expires: 7, path: '/'});
			    $.cookie('chat_stateless_user_name_twitter', T.currentUser.data('name'), { expires: 7, path: '/'});
			    $.cookie('chat_stateless_user_image_twitter', T.currentUser.data('profile_image_url'), { expires: 7, path: '/'});
			    window.location.reload();
		    });
		    
		    T.bind("signOut", function (e) {
			    $.cookie('chat_stateless_user_type_104', $.cookie('chat_stateless_user_type_104').replace(',twitter', ''), { path: '/'});
			    $.cookie('chat_stateless_user_name_twitter', null, { path: '/'});
			    $.cookie('chat_stateless_user_image_twitter', null,{ path: '/'});
    
			    if (!logging_out) {
				    window.location.reload();
			    }
		    });
	    });
	}
    
	if (chat_localized['facebook_active']) {
	    $(".chat-facebook-signin-btn").html('<fb:login-button></fb:login-button>');
	    
	    $("body").append('<div id="fb-root"></div>');
	    
	    FB.init({appId: chat_localized.facebook_app_id, status: true, cookie: true, xfbml: true});
	    FB.Event.subscribe('auth.sessionChange', function(response) {
		if (!response.session) {
		    $.cookie('chat_stateless_user_type_104', $.cookie('chat_stateless_user_type_104').replace(',facebook', ''), { path: '/'});
		    $.cookie('chat_stateless_user_name_facebook', null, { path: '/'});
		    $.cookie('chat_stateless_user_image_facebook', null, { path: '/'});
		}
		if (!logging_out) {
		    window.location.reload();
		}
	    });
	    FB.getLoginStatus(function(response) {
		if (response.session) {			
		    $(".chat-facebook-signin-btn").html('<button class="chat-facebook-signout-btn" type="button">'+chat_localized.facebook_text_sign_out+'</button>');
		    $(".chat-facebook-signout-btn").bind("click", function () {
			FB.logout();
		    });
		}
	    });
	}
	
	$('input.chat-logout-submit').click(function () {
	    try {
		if ($.cookie('chat_stateless_user_type_104') && $.cookie('chat_stateless_user_type_104').match('public_user')) {
		    $.cookie('chat_stateless_user_type_104', $.cookie('chat_stateless_user_type_104').replace(',public_user', ''), { path: '/'});
		    $.cookie('chat_stateless_user_name_public_user', null, { path: '/'});
		    $.cookie('chat_stateless_user_image_public_user', null, { path: '/'});
		    
		    window.location.reload();
		}
		
		if ($.cookie('chat_stateless_user_type_104') && $.cookie('chat_stateless_user_type_104').match('facebook')) {
		    if (chat_localized['facebook_active']) {
			FB.logout();
		    }
		}
		
		if ($.cookie('chat_stateless_user_type_104') && $.cookie('chat_stateless_user_type_104').match('twitter')) {
		    if (chat_localized['twitter_active']) {
			twttr.anywhere(function (T) {
			    twttr.anywhere.signOut();
			});
		    }
		}
	    } catch (e) {
		$.cookie('chat_stateless_user_type_104', '', { path: '/'});
		$.cookie('chat_stateless_user_name_public_user', null, { path: '/'});
		$.cookie('chat_stateless_user_image_public_user', null, { path: '/'});
		$.cookie('chat_stateless_user_name_twitter', null, { path: '/'});
		$.cookie('chat_stateless_user_image_twitter', null, { path: '/'});
		$.cookie('chat_stateless_user_name_facebook', null, { path: '/'});
		$.cookie('chat_stateless_user_image_facebook', null, { path: '/'});
		
		window.location.reload();
	    }
	});
    })(jQuery);
}

/**
 * From php.js
 *
 * See base64.min.js for license and copyright
 **/
function base64_decode(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,dec="",tmp_arr=[];if(!data){return data;}
data+='';do{h1=b64.indexOf(data.charAt(i++));h2=b64.indexOf(data.charAt(i++));h3=b64.indexOf(data.charAt(i++));h4=b64.indexOf(data.charAt(i++));bits=h1<<18|h2<<12|h3<<6|h4;o1=bits>>16&0xff;o2=bits>>8&0xff;o3=bits&0xff;if(h3==64){tmp_arr[ac++]=String.fromCharCode(o1);}else if(h4==64){tmp_arr[ac++]=String.fromCharCode(o1,o2);}else{tmp_arr[ac++]=String.fromCharCode(o1,o2,o3);}}while(i<data.length);dec=tmp_arr.join('');dec=this.utf8_decode(dec);return dec;}
function base64_encode(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!data){return data;}
data=this.utf8_encode(data+'');do{o1=data.charCodeAt(i++);o2=data.charCodeAt(i++);o3=data.charCodeAt(i++);bits=o1<<16|o2<<8|o3;h1=bits>>18&0x3f;h2=bits>>12&0x3f;h3=bits>>6&0x3f;h4=bits&0x3f;tmp_arr[ac++]=b64.charAt(h1)+b64.charAt(h2)+b64.charAt(h3)+b64.charAt(h4);}while(i<data.length);enc=tmp_arr.join('');switch(data.length%3){case 1:enc=enc.slice(0,-2)+'==';break;case 2:enc=enc.slice(0,-1)+'=';break;}
return enc;}
function utf8_decode(str_data){var tmp_arr=[],i=0,ac=0,c1=0,c2=0,c3=0;str_data+='';while(i<str_data.length){c1=str_data.charCodeAt(i);if(c1<128){tmp_arr[ac++]=String.fromCharCode(c1);i++;}else if((c1>191)&&(c1<224)){c2=str_data.charCodeAt(i+1);tmp_arr[ac++]=String.fromCharCode(((c1&31)<<6)|(c2&63));i+=2;}else{c2=str_data.charCodeAt(i+1);c3=str_data.charCodeAt(i+2);tmp_arr[ac++]=String.fromCharCode(((c1&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}
return tmp_arr.join('');}
function utf8_encode(argString){var string=(argString+'');var utftext="";var start,end;var stringl=0;start=end=0;stringl=string.length;for(var n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++;}else if(c1>127&&c1<2048){enc=String.fromCharCode((c1>>6)|192)+String.fromCharCode((c1&63)|128);}else{enc=String.fromCharCode((c1>>12)|224)+String.fromCharCode(((c1>>6)&63)|128)+String.fromCharCode((c1&63)|128);}
if(enc!==null){if(end>start){utftext+=string.substring(start,end);}
utftext+=enc;start=end=n+1;}}
if(end>start){utftext+=string.substring(start,string.length);}
return utftext;}

// php.js end