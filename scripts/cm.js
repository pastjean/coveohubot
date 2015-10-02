// Description:
//   hubot does sentiment analysis
//
// Commands:
//   !cm <text> : Send mail to cmrequest@coveo.com
//
// Author:
//   pastjean
//   marcantoineveilleux
//   guisim
//   carlbolduc
//   dblanchette
var postmark = require('postmark');
var HUBOT_POSTMARK_API_KEY = process.env.HUBOT_POSTMARK_API_KEY;

var MAX_SUBJECT_LENGTH = 100

module.exports = function(robot){
	if(!HUBOT_POSTMARK_API_KEY){
		robot.logger.error('HUBOT_POSTMARK_API_KEY not set');
	}

	robot.hear(/^!cm (.*)/i, function(msg){
		if(!HUBOT_POSTMARK_API_KEY){
			msg.send('HUBOT_POSTMARK_API_KEY environment variable not set');
			return;
		}

		var client = new postmark.Client(HUBOT_POSTMARK_API_KEY);
        var subject = msg.message.text.slice(4, MAX_SUBJECT_LENGTH + 4)
        if(msg.message.text.length > MAX_SUBJECT_LENGTH + 4){
            subject += "..."
        }
		client.sendEmail({
			"From" : "cloudops@coveo.com",
			"To" : "cmrequest@coveo.com",
			"Subject" : subject,
			"TextBody" : "From: " +  msg.message.user.name + "@coveo.com \n" + msg.message.text.slice(4)
		}, function (error, success) {

			if(error){
				msg.send("Failed to send email to cmrequest@coveo.com. Cause: " + error.message);
				return
			}
			msg.send("Successfully sent email to cmrequest@coveo.com.");
		});

	});
};
