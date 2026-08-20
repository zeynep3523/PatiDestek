using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace PatiDestekAPI.Services
{
    public class EmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> options, ILogger<EmailService> logger)
        {
            _settings = options.Value;
            _logger = logger;
        }

        public void SendEmail(string to, string subject, string body)
        {
            try
            {
                var email = new MimeMessage();

                email.From.Add(new MailboxAddress("Pati Destek", _settings.Email));
                email.To.Add(MailboxAddress.Parse(to));

                email.Subject = subject;
                email.Body = new TextPart("plain")
                {
                    Text = body
                };

                using var smtp = new SmtpClient
                {
                    Timeout = 8000
                };

                smtp.Connect(_settings.SmtpServer, _settings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_settings.Email, _settings.AppPassword);

                smtp.Send(email);
                smtp.Disconnect(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "E-posta gönderilemedi. Alıcı: {To}", to);
            }
        }
    }
}