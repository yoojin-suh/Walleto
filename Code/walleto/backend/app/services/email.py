import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


async def send_otp_email(email: str, otp_code: str, purpose: str):
    """
    Send OTP verification email to user using simple SMTP.

    Args:
        email: Recipient email address
        otp_code: 6-digit OTP code
        purpose: 'signup' or 'signin'
    """
    try:
        purpose_text = "Sign Up" if purpose == "signup" else "Sign In"

        # Create email message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Your Walleto Verification Code - {otp_code}"
        msg['From'] = settings.SMTP_FROM
        msg['To'] = email

        # HTML email body
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f9f9f9;
                    padding: 40px 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .otp-code {{
                    background: white;
                    border: 2px dashed #667eea;
                    padding: 20px;
                    text-align: center;
                    margin: 30px 0;
                    border-radius: 8px;
                }}
                .otp-digits {{
                    font-size: 48px;
                    font-weight: bold;
                    color: #667eea;
                    letter-spacing: 8px;
                    font-family: 'Courier New', monospace;
                }}
                .warning {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                }}
                .footer {{
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                    margin-top: 30px;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Walleto</h1>
                <p>Your Verification Code</p>
            </div>
            <div class="content">
                <h2>Hello!</h2>
                <p>You requested to {purpose_text.lower()} to your Walleto account.</p>
                <p>Please use the following verification code to complete your {purpose_text.lower()}:</p>

                <div class="otp-code">
                    <div class="otp-digits">{otp_code}</div>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Valid for 6 minutes</p>
                </div>

                <p>Enter this code on the verification page to proceed.</p>

                <div class="warning">
                    <strong>⚠️ Security Notice:</strong><br>
                    If you didn't request this code, please ignore this email and ensure your account is secure.
                    Never share this code with anyone.
                </div>
            </div>
            <div class="footer">
                <p>This is an automated email from Walleto. Please do not reply.</p>
                <p>&copy; 2024 Walleto. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

        # Attach HTML content
        html_part = MIMEText(html, 'html')
        msg.attach(html_part)

        # Send email via SMTP
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()  # Secure connection
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)

        logger.info(f"OTP email sent successfully to {email} for {purpose}")

    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        raise Exception(f"Failed to send verification email. Please check your email address or try again later.")
