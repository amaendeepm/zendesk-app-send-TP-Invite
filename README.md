# App name

A Zendesk App where you can send Trustpilot Review invitation for your business domain after Submitting a Zendesk ticket

### The following information is displayed:

* Please provide tpuser & tppassword default values at manifest.json

* Please replace reference of < < Base64 value of APIKey:Secret >> with appropriate Base64'ed APIKey:Secret credentials for your Trustpilot Business Account

* A new hidden field setup is required in your Zendesk be to used by this app to temporarily store access token, here every reference to custom_field_25795205 inside app.js should be replaced with appropriate custom-field ID

* For changing Trustpilot template ID, locale, sender-email, reply-to address please set it inside method tpSendInvite at app.js ( Code is self-explanatory while making API call to https://developers.trustpilot.com/invitation-api#Create%20new%20invitation

* As of now this is triggered for every ticket submit (irrespective of SOLVED), you should explicitly choose the lifecycle for which you want this script to be triggered





