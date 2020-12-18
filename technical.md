# More Steps
## Handle Inbound messages

Most Twilio services use webhooks to [communicate](https://www.twilio.com/docs/usage/tutorials/how-to-set-up-your-node-js-and-express-development-environment#install-ngrok-for-local-development) with your application. When Twilio receives an incoming phone call, for example, it reaches out to a URL in your application for instructions on how to handle the call.

When you’re working on your Express application in your development environment your app is <ins>only reachable by other programs on the same computer, so Twilio won’t be able to talk to it.</ins>

> [Ngrok](https://ngrok.com/download) is our favorite tool for solving this problem. Once started, it provides a unique URL on the ngrok.io domain which will forward incoming requests to your local development environment.

To start ngrok :arrow_forward: in your computer and receive external request, you need to run the command:

```
./ngrok http <PORT>
```

Few steps for authentication are needed, but it is all explained in [downoad page](https://ngrok.com/download)


---
## Webhooks

In order to work with the received webhooks we need to parse with urlencoded

```javascript
var express = require('express'),
  app = express();

app.use(express.urlencoded({
  extended: true
}));
```

> You can configure the URLs and HTTP Methods Twilio uses to make its requests via your account portal or using the [REST API](https://www.twilio.com/docs/sms/api).

### [Alerts](https://www.twilio.com/docs/usage/webhooks/getting-started-twilio-webhooks#finding-the-right-webhooks) Webhooks

> In addition to product-specific webhooks, your web application may receive webhooks from Twilio for events such as an error in TwiML returned by your application, or exceeding a certain number of text messages sent per month.

TwiML does not need to be returned to a status webhook, though it's recommended that you respond with either a *204 No Content* or a *200 OK* with Content-Type: *text/xml* and an empty `<Response/>` in the body.

---

## Reply messages

> When Twilio receives a message for one of your Twilio numbers or Channels, it makes a synchronous HTTP request to the message URL configured for that number or Channel and <ins>expects to receive TwiML in response</ins>

Receiving an WhatsApp message with the *Webhook*s is the same process as receive an SMS, but there is a different identifier in the number (<ins>it starts with an 'whatsapp:'</ins>). After Receiving the message on the route, you can use `MessagingResponse.message()` to create the reply message

```javascript

app.post('/receivemessage', (req, res) => {
  var wppMessage = req.body;

  const response = new MessagingResponse();
  response.message('This is a reply message');
  res.setHeader('Content-Type', 'application/xml');
  res.send(response.toString());
});

```

The `MessagingResponse.toString()` (`response.toString()`) will create the response message in <ins>Twilio Markup Language</ins> ([TwiML](https://www.twilio.com/docs/sms/twiml)), which should be send back as (the body) response. Other configurations can be applied to the [response message](https://www.twilio.com/docs/libraries/reference/twilio-node/3.54.0/MessagingResponse.html))

It is also important to configure a <ins>status</ins> route. For every interaction with the message (message sent, received, read, etc...) Twilio will send a status post request (you can set up the endpoint [here](https://www.twilio.com/console/sms/whatsapp/sandbox)).

---

### Reply with Emojis

To reply with emojis, you can copy and paste the emojis (you can find some emojis [here](https://unicode.org/emoji/charts/full-emoji-list.html)) in your response code

```javascript
const response = new MessagingResponse();
response.message('Hello 😜');
```

---
### Caching

Twilio cannot cache POSTs. If you want Twilio to cache static TwiML pages, then have Twilio make requests to your application using GET.

---
### How to Test (Mock)?

Working in progress... :gear::hammer::wrench::nut_and_bolt:

---