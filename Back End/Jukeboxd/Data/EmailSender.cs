using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity.UI.Services;
using MimeKit;

namespace Jukeboxd.Data
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;


        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            try
            {
                var Sender = _configuration["Email"];
                var Password = _configuration["Password"];

                var emailToSend = new MimeMessage();
                emailToSend.From.Add(MailboxAddress.Parse(Sender));
                emailToSend.To.Add(MailboxAddress.Parse(email));
                emailToSend.Subject = subject;
                emailToSend.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = htmlMessage
                };
                using (var emailClient = new SmtpClient())
                {
                    emailClient.Connect(
                        "smtp.gmail.com",
                        587,
                        MailKit.Security.SecureSocketOptions.StartTls
                    );
                    emailClient.Authenticate(Sender, Password);
                    emailClient.Send(emailToSend);
                    emailClient.Disconnect(true);
                }
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
        }
    }
}
