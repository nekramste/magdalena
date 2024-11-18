using FF.Magdalena;
using FF.Magdalena.Configuration;
using FF.Magdalena.Handlers;
using FF.Magdalena.Mappings;
using FF.Magdalena.Registration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using VueCliMiddleware;

namespace FF.Magdalena
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSerilog();
            services.AddMassTransitSettings(this.Configuration);
            services.AddConfiguration(this.Configuration);
            services.AddNewtonsoftJsonSerializer();
            services.AddHttpAgents();
            services.AddAutoMapper();
            
            //services.AddMvc(options => options.EnableEndpointRouting = false);

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp";
            });

            services.AddServices(sc =>
            {
                sc.Configure<RabbitMqConfiguration>(opt => Configuration.GetSection("RabbitMqConfiguration").Bind(opt));
            });
            services.AddCors(o => o.AddPolicy("LocalPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));
            services.AddWebSocketManager();

            JsonConvert.DefaultSettings = (() =>
            {
                var settings = new JsonSerializerSettings();
                settings.Converters.Add(new StringEnumConverter { AllowIntegerValues = false });
                return settings;
            });
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            var serviceScopeFactory = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>();
            var serviceProvider = serviceScopeFactory.CreateScope().ServiceProvider;


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCustomMiddleWares();
            app.UseMassTransit();
            app.UseWebSockets(new WebSocketOptions
            {
                KeepAliveInterval = TimeSpan.FromSeconds(30),
            });

            app.MapWebSocketManager("/scores", serviceProvider.GetService<ScoreMessageHandler>());
            app.UseStaticFiles();
            app.UseRouting();
            app.UseSpaStaticFiles();
            app.UseCors("LocalPolicy");
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                if (env.IsDevelopment())
                    spa.Options.SourcePath = "ClientApp/";
                else
                    spa.Options.SourcePath = "dist";

                if (env.IsDevelopment())
                {
                    spa.UseVueCli(npmScript: "serve");
                }
            });
        }
    }
}
