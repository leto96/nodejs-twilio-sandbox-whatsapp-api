require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID,
  authToken = process.env.TWILIO_ACCOUNT_TOKEN,
  PORT = process.env.PORT || 3000,
  twilio = require('twilio'),
  client = twilio(accountSid, authToken),
  MessagingResponse = twilio.twiml.MessagingResponse;
  myRobotContact = 'whatsapp:' + process.env.ROBOT_NUMBER;

const express = require('express'),
  app = express()

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('incoming request');
  res.send('Hello');
});

app.post('/testwebhook', (req, res) => {
  const response = new MessagingResponse();
  response.message('Olá, Matheus');

  console.log('response to webhook');
  console.log(response.toString());
  res.setHeader('Content-Type', 'application/xml');
  res.send(response.toString());
});

app.post('/inboundmessage', async (req, res) => {
  var wppMessage = req.body;
  // wppMessage.From -> Number that sent the message
  // wppMessage.Body -> message content

  try {
    console.log(wppMessage.Body);

    const response = new MessagingResponse();
    response.message('Hello!!\nI\'m your friend bot');
    res.setHeader('Content-Type', 'application/xml');
    res.send(response.toString());
    
  } catch (error) {
    console.log('Error in inboundmessage');
    console.log(error);
    res.status(500);
    res.send();
  }
});

app.post('/error', (req, res) => {
  console.log('Incoming error webhook body...');
  console.log(req.body);
});

app.post('/status', (req, res) => {
  console.log('Incoming status webhook body...');
  console.log(req.body);

  res.status(200).setHeader('Content-Type', 'text/xml');
  res.send('<Response/>');
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('The app has started on PORT: ' + PORT);
  }

})