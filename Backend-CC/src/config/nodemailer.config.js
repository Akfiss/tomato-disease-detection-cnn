import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
    user: process.env.MAIL_USER,
    pass: process.env.APP_PASSWORD
    }
});

export default transporter;
