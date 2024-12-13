/*
* CRA Chat with Charlie Chatbot
* -- Main application code
*/

"use strict";

window.onload = function () {

	var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
	if (isIE) {
		//<p>This browser is not supported</p>
		$('#chat-bottom-bar header .iconparent').html("");
		$('#chat-bottom-bar').css("width", "455px")
		$('#chat-bottom-bar header h2').removeAttr("data-gc-analytics-customclick title");
		$('#chat-bottom-bar header button.toprightbtn.rightMost').removeAttr("data-gc-analytics-customclick title");

		$('#chat-bottom-bar header button.toprightbtn.rightMost').html("");
		$('#chat-bottom-bar header h2').css("margin-left", "15px")
		$('#chat-bottom-bar header h2').html("<strong>The chatbot is unsupported on this browser</strong>");
		$('section#chat-bottom-bar button').remove();
		$('#chat-bottom-bar header').css("cursor", "default");

	} else {

		$("#chat-bottom-bar").show();
		$("#chat-bottom-bar.chat.minimizedchat header").on("click", startChatSession);
		$("#toggleCollapse").on("click", function (e) {
			$("#toggleExpand").show();
			$("#toggleCollapse").hide();
			$("#toggleSmall").hide();
			$("#toggleMax").show();
			$("#chat-bottom-bar").addClass("smallchat");
			$("#chat-bottom-bar").removeClass("fullchat");
			$("#chat-bottom-bar").removeClass("expandedchat");
			$("#chat-bottom-bar").addClass("minimizedchat");
			$("#chat-bottom-bar").animate({
				"height": "40px"
			}, {
				"duration": 200,
				"queue": false
			});
			$("#chat-bottom-bar").animate({
				"width": "275px"
			}, {
				"duration": 200,
				"queue": false
			}); //$("#chat-bottom-bar .modal-body").animate({"padding" : "0"}, {"duration":200, "queue": false});

			$("#toggleSmall").hide();
			$("#toggleMax").hide();
			return false;
		}); //when collapsed, register any click on header

		$("#chat-bottom-bar.chat.minimizedchat header").on("click", function () {
			$("#toggleExpand").hide();
			$("#toggleCollapse").show();
			$("#unreadMsgSpan").empty();
			$("#unreadMsgSpanContainer").hide();
			$("#chat-bottom-bar").addClass("expandedchat");
			$("#chat-bottom-bar").removeClass("minimizedchat");
			$("#chat-bottom-bar").animate({
				"height": "80%"
			}, {
				"duration": 200,
				"queue": false
			});
			$("#chat-bottom-bar").animate({
				"width": "434px"
			}, {
				"duration": 200,
				"queue": false
			}); //$("#chat-bottom-bar .modal-body").animate({"padding" : "0"}, {"duration":200, "queue": false});

			if ($("#chat-bottom-bar").hasClass("smallchat")) {
				$("#toggleSmall").hide();
				$("#toggleMax").show();
			}

			if ($("#chat-bottom-bar").hasClass("fullchat")) {
				$("#toggleSmall").show();
				$("#toggleMax").hide();
			}

			return false;
		});
		$("#toggleSmall").on("click", function () {
			$("#toggleSmall").hide();
			$("#toggleMax").show();
			$("#chat-bottom-bar").animate({
				"height": "80%"
			}, {
				"duration": 200,
				"queue": false
			});
			$("#chat-bottom-bar").animate({
				"width": "434px"
			}, {
				"duration": 200,
				"queue": false
			});
			$("#chat-bottom-bar").addClass("smallchat");
			$("#chat-bottom-bar").removeClass("fullchat");
			return false;
		});
		$("#toggleMax").on("click", function () {
			$("#toggleSmall").show();
			$("#toggleMax").hide(); //$("#chat-bottom-bar").width("90%");

			$("#chat-bottom-bar").animate({
				"width": "90%"
			}, {
				"duration": 200,
				"queue": false
			});
			$("#chat-bottom-bar").animate({
				"height": "100%"
			}, {
				"duration": 200,
				"queue": false
			});
			$("#chat-bottom-bar").removeClass("smallchat");
			$("#chat-bottom-bar").addClass("fullchat");
			return false;
		});
		if (/[&?]chat=1/.test(location.search)) $("#chat-bottom-bar header").click();
	}
};

function startChatSession() {
	$("#chat-bottom-bar.chat.minimizedchat header").off("click", startChatSession);
	$("#chatstatus").text("(connecting...)");
	/*
    
	   $("#chat-bottom-bar .modal-body").height() = 0;
    
	   $("#chat-bottom-bar .modal-body iframe").css("minHeight", 0);
    
		$("#chat-bottom-bar #webchat").css("minHeight", 0);
    
		*/
	//$("#chat-bottom-bar .modal-body").hide();
	// url: "https://cra-prod-bot-app.azurewebsites.net/directline/token",

	$("#chat-bottom-bar").show();
	if (/[&?]lang=fr/.test(location.search)) wb.lang = "fr";
	$.ajax({
		url: "https://cra-prod-bot-app.azurewebsites.net/directline/token",
		type: "POST",
		crossDomain: true,
		dataType: 'json',
		success: function success(response) {
			var token = response.token;
			var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
			var webSocket = true;

			if (isIE) {
				webSocket = false;
			} //Send activity so we receive welcome card https://github.com/microsoft/BotFramework-WebChat/tree/master/samples/15.d.backchannel-send-welcome-event


			var store = window.WebChat.createStore({}, function (_ref) {
				var dispatch = _ref.dispatch;
				return function (next) {
					return function (action) {
						if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
							// When we receive DIRECT_LINE/CONNECT_FULFILLED action, we will send an event activity using WEB_CHAT/SEND_EVENT
							// use value: { language: wb.lang }
							dispatch({
								type: 'WEB_CHAT/SEND_EVENT',
								payload: {
									name: 'webchat/join',
									value: {
										"language": wb.lang,
										"introCard": ["intro"]
									}
								}
							});
						}

						if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
							var event = new Event('webchatincomingactivity');
							event.data = action.payload.activity;
							window.dispatchEvent(event);
						}

						return next(action);
					};
				};
			}); //botAvatarInitials: 'CC'

			var styleOptions = {
				hideUploadButton: true,
				//default: false
				bubbleBackground: 'White',
				//default: White
				botAvatarBackgroundColor: 'White',
				//default: undefined, WET blue is rgb(37, 114, 180) but it doesn't
				bubbleFromUserBackground: 'White',
				//default: White
				userAvatarBackgroundColor: 'rgb(0,97,101)',
				//default: undefined
				botAvatarInitials: 'Bot',
				userAvatarInitials: 'You',
				botAvatarImage: "/content/dam/cra-arc/chatbot/avatar_head.png"
			};
			window.WebChat.renderWebChat({
				directLine: window.WebChat.createDirectLine({
					token: token,
					webSocket: webSocket
				}),
				store: store,
				resize: 'detect',
				locale: wb.lang + '-CA',
				styleOptions: styleOptions
			}, document.getElementById('webchat')); // document.querySelector('#webchat > *').focus();
		},
		error: function error(xhr, status, _error) {
			//alert("error: " + JSON.stringify(xhr));
			$("#chatstatus").text(JSON.stringify(xhr));
			$("#webchat").hide();
		}
	});
	window.addEventListener('webchatincomingactivity', function (_ref2) {
		var data = _ref2.data;
		$("#chatstatus").empty();
		$("#webchat").show();

		if (data.type === "message" && $("#chat-bottom-bar").hasClass("minimizedchat") && data.from.role != "user") {
			$("#unreadMsgSpanContainer").show(); //alert(Number($("#unreadMsgSpan").text()));

			$("#unreadMsgSpan").text(Number($("#unreadMsgSpan").text()) + 1);
		}
	});
}
