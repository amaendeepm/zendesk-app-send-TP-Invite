(function () {

    return {
        
        events: {
            'app.activated': 'doSomething',
            'ticket.save': 'sendInvite',
            'getToken.done': 'tokenSuccess',
            'getToken.fail': 'tokenFail'
        },

        requests: {

            getToken: function (new_task_data) {
                return {
                    url: 'https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken',
                    headers: {"Authorization": "Basic <<Base64 value of APIKey:Secret>>"},
                    type: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    data: {'grant_type': 'password', 'username': this.setting('tpuser'), 'password': this.setting('tppass')}
                };
            },
            
            tpSendInvite: function (email, refid, name, handler, token) {
                console.log("TP Invite going with= " + name + " " +email + " " + handler +" "+ token);
				console.log(JSON.stringify({"recipientEmail": email,"recipientName": name,"referenceId": refid,"templateId": "55cd896f95b5540ab45c06a7","locale": "en-GB","senderEmail": "ami@trustpilot.com","senderName": "Bundingo Business Support","replyTo":"noreply.invitations@trustpilot.com","preferredSendTime": "2013-09-07T13:37:00"}));
                return {
                    url: 'https://invitations-api.trustpilot.com/v1/private/business-units/556727b40000ff00057fbace/invitations?token=' + token,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
						"recipientEmail": email,
						"recipientName": name,
						"referenceId": refid,
						"templateId": "55cd896f95b5540ab45c06a7",
						"locale": "en-GB",
						"senderEmail": "ami@trustpilot.com",
						"senderName": "Bundingo Business Support",
						"replyTo": "noreply.invitations@trustpilot.com",
						"preferredSendTime": "2013-09-07T13:37:00"
                    }),
                    secure: true

                };
            }

        },

        tokenSuccess: function (data) {
            console.log("token success ");
            console.log(data.access_token);
            var ticket = this.ticket();
            ticket.customField("custom_field_25795205", data.access_token); // access token
            services.notify('Ready to send Trustpiot Invite from Zendesk');
        },
        
        tokenFail: function (data) {
            console.log("token success ");
            console.log(data);
            services.notify('ERROR GETTING OAUTH TOKEN: CANNOT Post Review Replies from Zendesk');
        },
        
        doSomething: function () {
            console.log("Sending TP Review Invite App is activated");
            this.ajax('getToken');
        },

        sendInvite: function () {
            var ticket = this.ticket();
            console.log('starting to send TP invite to ' + ticket.recipient());
			return this.promise(function (done, fail) {
				this.ajax('tpSendInvite', ticket.requester().email(), ticket.id(), ticket.requester().name(), ticket.assignee().user().name(),ticket.customField("custom_field_25795205")).then(
					function (data) {
						//console.log("reply success");
						services.notify('Successfully sent Trustpilot Review Invitation');
						done();
					},
					function () {
						console.log("Failed to send invite");
						services.notify('Problem with sending Review Invitation', 'error');
						done();
					}
				);
			});
		}
    };

}());