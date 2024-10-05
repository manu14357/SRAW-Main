// utils/emailTemplates.js

const generateWelcomeEmail = (username) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Sraws!</title>
        <style>
          /* Global Reset */
          body, html {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            background-color: #f0f0f0;
          }
          
          /* Responsive Container */
          .container {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          
          /* Header Styles */
          .header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            border-bottom: 4px solid #0056b3;
          }
          
          /* Content Section */
          .content {
            padding: 20px;
            color: #333333;
          }
          
          .content h1 {
            color: #007BFF;
            font-size: 24px;
            margin-top: 0;
          }
          
          .content p {
            margin: 10px 0;
          }
          
          .featured-content {
            margin: 20px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 5px solid #007BFF;
          }
          
          /* Button Styles */
          .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
          }
          
          .button:hover {
            background-color: #0056b3;
          }
          
          /* Social Media Links */
          .social-media {
            margin: 20px 0;
            text-align: center;
          }
          
          .social-media a {
            margin: 0 10px;
            color: #007BFF;
            text-decoration: none;
          }
          
          .social-media a:hover {
            text-decoration: underline;
          }
          
          /* Footer Styles */
          .footer {
            background-color: #f0f0f0;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #888888;
          }
          
          .footer a {
            color: #007BFF;
            text-decoration: none;
          }
          
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <table class="container">
          <tr>
            <td>
              <div class="header">
                Welcome to Sraws, ${username}!
              </div>
            </td>
          </tr>
          <tr>
            <td class="content">
              <h1>Hello ${username},</h1>
              <p>Welcome to Sraws! We’re delighted to have you join our platform, where we focus on creating a safe and supportive community.</p>
              <p>Sraws is dedicated to helping people by sharing and learning from experiences related to scams, frauds, and other negative incidents. By participating, you can contribute valuable insights and help prevent others from facing similar challenges.</p>
              <div class="featured-content">
                <h2>About Sraws</h2>
                <p>At Sraws, we provide a space where users can post about scams, frauds, and other troubling incidents they've encountered. Our platform empowers individuals to share their stories and warnings, which helps to protect others and build a stronger community.</p>
                <p>Your contributions not only aid in spreading awareness but also earn you social points. These points recognize your efforts and can be shared with your community to foster support and solidarity.</p>
              </div>
              <p>We encourage you to explore the platform, share your experiences, and connect with others. Every post and interaction helps to build a safer and more informed community. Together, we can make a difference!</p>
              <a href="" class="button">Start Sharing</a>
            </td>
          </tr>
          <tr>
            <td class="social-media">
              <p>Stay connected with us:</p>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>Best regards,<br>The Sraws Team</p>
              <p>&copy; 2024 Sraws. All rights reserved. <br> <a href="#">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };
  
  module.exports = { generateWelcomeEmail };
  