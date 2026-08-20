using PatiDestekAPI.Data;
using PatiDestekAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using PatiDestekAPI.Middleware;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using PatiDestekAPI.Hubs;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Controllers


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
                origin == "http://localhost:5173" ||
                origin.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase))
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddSignalR();
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("ApiLimiter", limiterOptions =>
    {
        limiterOptions.PermitLimit = 20;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 5;
    });
});

// PostgreSQL
var pgHost = builder.Configuration["PGHOST"];
var connectionString = !string.IsNullOrEmpty(pgHost)
    ? $"Host={pgHost};Port={builder.Configuration["PGPORT"]};" +
      $"Database={builder.Configuration["PGDATABASE"]};" +
      $"Username={builder.Configuration["PGUSER"]};" +
      $"Password={builder.Configuration["PGPASSWORD"]};" +
      "SSL Mode=Require;Trust Server Certificate=true"
    : builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Render assigns the listen port via $PORT
var renderPort = builder.Configuration["PORT"];
if (!string.IsNullOrEmpty(renderPort))
{
    builder.WebHost.UseUrls($"http://+:{renderPort}");
}

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("JWT Hatası: " + context.Exception.Message);
                return Task.CompletedTask;
            },

            OnChallenge = context =>
            {
                Console.WriteLine("Challenge: " + context.ErrorDescription);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Token Service
builder.Services.AddScoped<TokenService>();
// Email Settings
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

// Email Service
builder.Services.AddScoped<EmailService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Pati Destek API",
        Version = "v1",
        Description = "Sokak hayvanı ihbar sistemi API"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Bearer {token} formatında JWT giriniz."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

    var seedEmail = builder.Configuration["SeedSuperAdmin:Email"];
    var seedPassword = builder.Configuration["SeedSuperAdmin:Password"];

    if (!string.IsNullOrEmpty(seedEmail) && !string.IsNullOrEmpty(seedPassword))
    {
        var existing = dbContext.Users
            .FirstOrDefault(u => u.Email.ToLower() == seedEmail.ToLower());

        if (existing != null)
        {
            existing.Role = "SuperAdmin";
            existing.Password = BCrypt.Net.BCrypt.HashPassword(seedPassword);
            existing.IsEmailVerified = true;
            dbContext.SaveChanges();
        }
        else if (!dbContext.Users.Any(u => u.Role == "SuperAdmin"))
        {
            dbContext.Users.Add(new PatiDestekAPI.Models.User
            {
                FirstName = "Süper",
                LastName = "Admin",
                Email = seedEmail,
                Phone = "0000000000",
                Password = BCrypt.Net.BCrypt.HashPassword(seedPassword),
                Role = "SuperAdmin",
                IsEmailVerified = true,
            });
            dbContext.SaveChanges();
        }
    }
}

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<PatiDestekAPI.Middleware.ExceptionMiddleware>();
app.UseHttpsRedirection();

// wwwroot klasöründeki dosyaları yayınla
app.UseStaticFiles();
app.UseCors("AllowReact");
app.Use(async (context, next) =>
{
    Console.WriteLine("Authorization Header: " + context.Request.Headers.Authorization);
    await next();
});
app.UseAuthentication();
app.UseRateLimiter();
app.UseAuthorization();

app.MapGet("/", () => "Pati Destek API Çalışıyor 🐾");

app.MapControllers().RequireRateLimiting("ApiLimiter");
 app.MapHub<NotificationHub>("/notificationHub");
app.Run();