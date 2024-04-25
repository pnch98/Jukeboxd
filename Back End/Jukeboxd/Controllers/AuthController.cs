using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net.Http.Headers;
using System.Text;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("authenticate")]
        public IActionResult Auth([FromBody] StateModel model)
        {
            string state = model.State;
            string url = _configuration["AuthUrl"] + "response_type=code&client_id=" + _configuration["ClientId"] + "&redirect_uri=" + _configuration["RedirectUri"] + "&scope=user-read-private%20user-top-read%20user-read-email&show_dialog=true&state=" + state;

            return Ok(new { url = url });
        }

        [HttpPost("callback")]
        public async Task<IActionResult> Callback([FromBody] CallbackModel model)
        {
            if (string.IsNullOrEmpty(model.State))
            {
                var query = new Dictionary<string, string> { { "error", "state_mismatch" } };
                var queryString = QueryHelpers.AddQueryString("/", query);
                return Redirect("/#" + queryString);
            }
            else
            {
                using (var client = new HttpClient())
                {
                    var url = _configuration["TokenUrl"];
                    var data = new Dictionary<string, string>
                    {
                        { "grant_type", "authorization_code" },
                        { "code", model.Code },
                        { "redirect_uri", _configuration["RedirectUri"] }
                    };

                    string credentials = _configuration["ClientId"] + ":" + _configuration["ClientSecret"];
                    string credentialsBase64 = Convert.ToBase64String(Encoding.ASCII.GetBytes(credentials));

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentialsBase64);

                    var response = await client.PostAsync(url, new FormUrlEncodedContent(data));
                    var responseString = await response.Content.ReadAsStringAsync();

                    // Verifica lo stato della risposta e gestisci eventuali errori...

                    // Restituisci la stringa JSON direttamente, assicurandoti che il content type sia corretto
                    return Content(responseString, "application/json");
                }
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshModel model)
        {
            using (var client = new HttpClient())
            {
                var url = _configuration["TokenUrl"];
                var data = new Dictionary<string, string>
                {
                    { "grant_type", "refresh_token" },
                    { "refresh_token", model.RefreshToken },
                };

                string credentials = _configuration["ClientId"] + ":" + _configuration["ClientSecret"];
                string credentialsBase64 = Convert.ToBase64String(Encoding.ASCII.GetBytes(credentials));

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentialsBase64);

                var response = await client.PostAsync(url, new FormUrlEncodedContent(data));
                var responseString = await response.Content.ReadAsStringAsync();

                // Verifica lo stato della risposta e gestisci eventuali errori...

                // Restituisci la stringa JSON direttamente, assicurandoti che il content type sia corretto
                return Content(responseString, "application/json");
            }
        }

        [HttpPost("setUser")]
        public async Task<IActionResult> SetUser([FromBody] UserModel model)
        {
            var user = await _context.Users.FindAsync(model.Id);

            if (user == null)
            {
                _context.Users.Add(new User
                {
                    Id = model.Id,
                    Username = model.Username,
                    Email = model.Email,
                    Image = model.Image
                });

                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
