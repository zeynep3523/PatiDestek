using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace PatiDestekAPI.Services
{
    public class EmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }

        public void SendEmail(string to, string subject, string body)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress("Pati Destek", _settings.Email));
            email.To.Add(MailboxAddress.Parse(to));

            email.Subject = subject;
            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            smtp.Connect(_settings.SmtpServer, _settings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_settings.Email, _settings.AppPassword);

            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}