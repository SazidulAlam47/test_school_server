import sendEmail from './sendEmail';
import { TLevel } from '../modules/question/question.interface';

const sendCertificateEmail = async (
    recipientEmail: string,
    recipientName: string,
    level: TLevel,
    pdfBuffer: Buffer,
) => {
    const subject = `🎉 Congratulations! Your ${level} Level Certificate is Ready`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin-bottom: 10px;">🎓 Test School</h1>
                    <h2 style="color: #e74c3c; margin: 0;">Certificate Achievement</h2>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <p style="font-size: 18px; color: #2c3e50; margin-bottom: 15px;">
                        Dear <strong>${recipientName}</strong>,
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #34495e; margin-bottom: 15px;">
                        Congratulations! 🎉 You have successfully completed the Digital Competency Assessment and achieved certification at <strong>${level} Level</strong>.
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #34495e; margin-bottom: 15px;">
                        Your dedication and hard work have paid off. This certificate represents your commitment to learning and your achievement in digital competency skills.
                    </p>
                </div>
                
                <div style="background-color: #f1f2f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">📋 Certificate Details:</h3>
                    <ul style="color: #34495e; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;"><strong>Recipient:</strong> ${recipientName}</li>
                        <li style="margin-bottom: 8px;"><strong>Level Achieved:</strong> ${level}</li>
                        <li style="margin-bottom: 8px;"><strong>Assessment:</strong> Digital Competency Assessment</li>
                        <li style="margin-bottom: 8px;"><strong>Issued Date:</strong> ${new Date().toLocaleDateString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            },
                        )}</li>
                    </ul>
                </div>
                
                <div style="background-color: #e8f5e8; border-left: 4px solid #27ae60; padding: 15px; margin-bottom: 25px;">
                    <p style="margin: 0; color: #27ae60; font-weight: bold;">
                        📎 Your official certificate is attached to this email as a PDF file.
                    </p>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">🚀 What's Next?</h3>
                    <p style="font-size: 16px; line-height: 1.6; color: #34495e; margin-bottom: 15px;">
                        • Share your achievement on social media and LinkedIn
                        • Add this certification to your professional profile
                        • Continue learning to achieve higher levels
                        • Explore our advanced courses and assessments
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                    <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                        Thank you for choosing Test School for your learning journey!
                    </p>
                    <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0 0 0;">
                        Visit us at <a href="#" style="color: #3498db;">testschool.com</a>
                    </p>
                </div>
            </div>
        </div>
    `;

    await sendEmail(
        recipientEmail,
        subject,
        html,
        pdfBuffer as Buffer<ArrayBuffer>,
    );
};

export default sendCertificateEmail;
