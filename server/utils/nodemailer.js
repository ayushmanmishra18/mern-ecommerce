import nodemailer from "nodemailer";

// Function to generate a random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a transporter object using Gmail's SMTP server
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ayushmanmishraji03@gmail.com', // Replace with your Gmail address
        pass: 'jfgcivrloymuwdmv'  // Replace with your Gmail password or App Password
    }
});

// Generate OTP
const otp = generateOTP();

// Email options
const mailOptions = {
    from: "ayushmanmishraji03@gmail.com", // Sender address
    to: 'recipient-email@example.com', // Recipient address
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is: ${otp}` // Plain text body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
        console.log('OTP:', otp);
    }
});