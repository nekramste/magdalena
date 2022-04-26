using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FF.Magdalena.Providers;
using FF.Magdalena.Middleware;
using FF.Magdalena.Consumers;
using FF.Magdalena.Configuration;
using Microsoft.AspNetCore.SpaServices.Webpack;
using FF.Magdalena.Handlers;
using FF.Magdalena.Mappings;
using FF.Magdalena.Registration;

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
            // Add framework services.
            //services.AddMvc()
            //    .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddMassTransitSettings(this.Configuration);
            services.AddNewtonsoftJsonSerializer();
            services.AddHttpAgents();
            services.AddAutoMapper();
            services.AddControllers();
            services.AddMvc(options => options.EnableEndpointRouting = false);

            // Simple example with dependency injection for a data provider.
            services.AddServices(sc =>
            {
                sc.Configure<RabbitMqConfiguration>(opt => Configuration.GetSection("RabbitMqConfiguration").Bind(opt));
            });
            services.AddCors(o => o.AddPolicy("LocalPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));
            services.AddWebSocketManager();

            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var serviceScopeFactory = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>();
            var serviceProvider = serviceScopeFactory.CreateScope().ServiceProvider;

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();


                //Webpack initialization with hot-reload.
                //app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                //{
                //    HotModuleReplacement = true,
                //});
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseMassTransit();
            app.UseWebSockets();
            app.MapWebSocketManager("/scores", serviceProvider.GetService<ScoreMessageHandler>());
            app.UseMiddleware<ChatWebSocketMiddleware>();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors("LocalPolicy");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}");
            });

        }
    }
}
