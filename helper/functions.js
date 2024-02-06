const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kathanipanpoli@gmail.com",
      pass: "xudk sche ruqf xiru"
    }
  });


  async function sendEmailFunction(email, otp) {
    console.log(email, otp, "--------otp ------------");
    const mailOptions = {
      from: "kathanipanpoli@gmail.com",
      to: `${email}`,
      subject: 'Node Mailer',
      text: 'Hello People!, Welcome to Bacancy!',
      html: `
        <p>Hello People!</p>
        <p>Welcome to Bacancy!</p>
        <p>Your OTP is ${otp} </p>
        <p>You can add more styling and structure here.</p>
        Thanks and Regards
        TaskManger@kathani
      `,
    };
    try {
      const sendEmailRes = await transport.sendMail(mailOptions);
      console.log(sendEmailRes);
      return sendEmailRes;
    } catch (err) {
      console.error(err);
      throw new Error('Error sending email');
    }
  }
  
 

module.exports = {
    sendEmailFunction
}