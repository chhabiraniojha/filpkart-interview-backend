const nodeMailer = require("nodemailer");


exports.sendEmail = async (option) => {
    const transport = nodeMailer.createTransport({
        // this is the sender mail and password  for login
        // host:  process.env.NODE_MAILER_HOST,
        host:"smtpout.secureserver.net",
        port: 465,
        secure: true,
        auth: {
            user:"interview@digidivine.solutions",
            pass:"rinku9938300585@",
        },
    });
    const mailoptions = {
        // this object contain all the option like --> sender,resiver and text message
        from:"interview@digidivine.solutions",
        to: option.email,
        subject: option.subject,
        text: option.message,
    };

    await transport.sendMail(mailoptions);
    return;
};
