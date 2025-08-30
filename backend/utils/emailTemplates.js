/**
 * Email Templates for SafeBait
 */

const getEmailWrapper = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    ${content}
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    <p style="color: #888; font-size: 12px; text-align: center; margin: 0;">
      SafeBait Security Team<br>
      This email was sent from an automated system, please do not reply.
    </p>
  </div>
`;

const getHeaderSection = (title, gradient) => `
  <div style="background: ${gradient}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">${title}</h1>
  </div>
`;

const getContentSection = (content) => `
  <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    ${content}
  </div>
`;

// Password Reset OTP Email Template
const getPasswordResetOTPTemplate = (otp) => {
  const header = getHeaderSection(
    "SafeBait",
    "linear-gradient(135deg, #7b1fa2 0%, #f50057 100%)"
  );

  const content = `
    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
    <p>You requested to reset your password for your SafeBait account.</p>
    
    <div style="background: #f0f0f0; padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7b1fa2;">
      <h1 style="color: #7b1fa2; letter-spacing: 8px; margin: 0; font-size: 32px;">${otp}</h1>
      <p style="margin: 15px 0 0 0; color: #666; font-weight: bold;">⏰ This OTP is valid for 3 minutes only</p>
    </div>
    
    <div style="background: #fff3e0; padding: 15px; border-radius: 5px; border-left: 4px solid #ff9800;">
      <p style="margin: 0; color: #e65100;">
        <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is safe.
      </p>
    </div>
  `;

  return getEmailWrapper(header + getContentSection(content));
};

const getPasswordResetSuccessTemplate = (frontendUrl) => {
  const header = getHeaderSection(
    "SafeBait",
    "linear-gradient(135deg, #4caf50 0%, #81c784 100%)"
  );

  const loginUrl = frontendUrl
    ? `${frontendUrl}/login`
    : "http://localhost:3000/login";

  const content = `
    <h2 style="color: #333; text-align: center;">✅ Password Reset Successful</h2>
    <p>Your SafeBait account password has been successfully reset.</p>
    <p>You can now login with your new password.</p>
    
    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50; margin: 20px 0;">
      <p style="margin: 0; color: #2e7d32;">
        <strong>✓ Password Updated:</strong> ${new Date().toLocaleString()}
      </p>
    </div>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${loginUrl}" 
         style="background: #7b1fa2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Login Now
      </a>
    </div>
  `;

  return getEmailWrapper(header + getContentSection(content));
};

const getWelcomeEmailTemplate = (userName, frontendUrl) => {
  const header = getHeaderSection(
    "Welcome to SafeBait!",
    "linear-gradient(135deg, #1565c0 0%, #e53935 100%)"
  );

  const loginUrl = frontendUrl
    ? `${frontendUrl}/login`
    : "http://localhost:3000/login";

  const content = `
    <h2 style="color: #333; text-align: center;">Welcome ${userName}!</h2>
    <p>Your SafeBait account has been created successfully.</p>
    <p>Start protecting your organization from phishing attacks by creating your first campaign.</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${loginUrl}" 
         style="background: #1565c0; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Get Started
      </a>
    </div>
  `;

  return getEmailWrapper(header + getContentSection(content));
};

module.exports = {
  getPasswordResetOTPTemplate,
  getPasswordResetSuccessTemplate,
  getWelcomeEmailTemplate,
};
