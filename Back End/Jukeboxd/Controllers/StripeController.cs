using Jukeboxd.Data;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Order = Jukeboxd.Models.Order;

namespace Jukeboxd.Controllers
{
    [Route("webhook")]
    [ApiController]
    public class StripeWebHookController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;

        public StripeWebHookController(ApplicationDbContext context, IEmailSender emailSender, IConfiguration configuration)
        {
            _context = context;
            _emailSender = emailSender;
            _configuration = configuration;
        }


        [HttpPost]
        public async Task<IActionResult> Index()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _configuration["StripeSecret"], throwOnApiVersionMismatch: false);
                // Handle the event
                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Stripe.Checkout.Session;

                    if (session == null)
                    {
                        return BadRequest();
                    }

                    // Trova l'ordine temporaneo
                    var tempOrder = await _context.TempOrders.FirstOrDefaultAsync(o => o.SessionId == session.Id);
                    var tempTicket = await _context.TempTickets.FirstOrDefaultAsync(t => t.SessionId == session.Id);

                    if (tempOrder == null && tempTicket == null)
                    {
                        return BadRequest();
                    }

                    if (tempOrder != null)
                    {

                        // Crea un nuovo ordine basato sull'ordine temporaneo
                        var order = new Order
                        {
                            UserId = tempOrder.UserId,
                            Address = tempOrder.Address,
                            City = tempOrder.City,
                            Total = tempOrder.Total,
                            Date = tempOrder.Date,
                        };
                        _context.Orders.Add(order);
                        await _context.SaveChangesAsync();

                        // Trova i dettagli dell'ordine temporaneo
                        var tempOrderDetails = await _context.TempOrderDetails.Where(d => d.TempOrderId == tempOrder.Id).ToListAsync();

                        if (tempOrderDetails == null)
                        {
                            return BadRequest();
                        }

                        foreach (var tempOrderDetail in tempOrderDetails)
                        {
                            // Crea un nuovo dettaglio dell'ordine basato sul dettaglio dell'ordine temporaneo
                            var orderDetail = new OrderDetails
                            {
                                OrderId = order.Id,
                                ProductId = tempOrderDetail.ProductId,
                                Quantity = tempOrderDetail.Quantity,
                                Price = tempOrderDetail.Price,
                            };
                            _context.OrderDetails.Add(orderDetail);

                            // Rimuovi il dettaglio dell'ordine temporaneo
                            _context.TempOrderDetails.Remove(tempOrderDetail);
                        }

                        // Rimuovi l'ordine temporaneo
                        _context.TempOrders.Remove(tempOrder);

                        await _context.SaveChangesAsync();
                    }

                    if (tempTicket != null)
                    {
                        var ticketEvent = await _context.Events.FindAsync(tempTicket.EventId);

                        if (ticketEvent == null)
                        {
                            return NotFound();
                        }

                        if (ticketEvent.IsSoldOut)
                        {
                            return BadRequest();
                        }

                        var ticket = new Ticket
                        {
                            EventId = tempTicket.EventId,
                            UserId = tempTicket.UserId,
                            Price = tempTicket.Price,
                        };
                        _context.Tickets.Add(ticket);

                        ticketEvent.nOfTickets--;

                        if (ticketEvent.nOfTickets == 0)
                        {
                            ticketEvent.IsSoldOut = true;
                        }
                        _context.Events.Update(ticketEvent);

                        _context.TempTickets.Remove(tempTicket);
                        await _context.SaveChangesAsync();

                        //send email
                        var artist = await _context.Artists.FindAsync(ticketEvent.ArtistId);
                        var artistName = "Artist";
                        var artistImg = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.creativefabrica.com%2Fit%2Fproduct%2Fticket-icon-template-9%2F&psig=AOvVaw11Qa-tk4JguietJOciNf8T&ust=1714034825943000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIidnbm72oUDFQAAAAAdAAAAABAJ";
                        if (artist != null)
                        {
                            artistName = artist.Name;
                            artistImg = artist.Image;
                        }
                        var email = session.CustomerEmail;
                        var subject = $"Ordine No. {ticket.Id} confermato";
                        var htmlMessage = $"<!DOCTYPE html>\r\n<html>\r\n<head>\r\n" +
                            $"    <title>Jukeboxd</title>\r\n    " +
                            $"<style>\r\n        " +
                                $"body {{ margin: 0 !important;}}\r\n        " +
                                $".TicketLogo {{ width: 120px; height: auto; }}\r\n      " +
                                $"#barcode img {{height: 75px; width: 75px; max-width:75px; max-height: 75px; }}\r\n      " +
                            $"</style>\r\n</head>\r\n" +
                            $"<body>\r\n    " +
                                $"<div class=\"TTicket\" style=\"margin: 0px; height: 192px; width: 600px;\">\r\n        " +
                                    $"<table width=\"100%\" style=\"font-family: Arial, Helvetica, sans-serif; font-size: 12px;\">\r\n            " +
                                        $"<tr>\r\n            " +
                                            $"<td width=\"150\" valign=\"top\" style=\"margin-left: 5px\">\r\n                " +
                                                $"<div style=\"padding: 10px 0 0 0;\">" +
                                                $"<img src=\"{artistImg}\" class=\"TicketLogo\" /></div>\r\n            " +
                                                $"</div>\r\n                " +
                                                $"<div style=\"padding: 5px 0 0 5px;\">OrderID #{ticket.Id}</div>\r\n                " +
                                                $"<div style=\"padding: 2px 0 0 5px;\"><b>{email}</b></div>\r\n            " +
                                            $"</td>\r\n            " +
                                            $"<td valign=\"top\" style=\"padding-top:10px; padding-left: 15px\">\r\n                " +
                                                $"<div style=\"padding: 15px 0 0 0; font-size: 16px;\"><b>{artistName}</b></div>\r\n                " +
                                                $"<div style=\"padding: 5px 0 0 0; font-size: 14px;\"><b>{ticketEvent.Date}</b></div>\r\n                " +
                                                $"<div style=\"padding: 15px 0 0 0; font-size: 14px;\"><b>{ticketEvent.City}</b></div>\r\n                " +
                                                $"<div style=\"padding: 0 0 0 0; font-size: 12px;\">{ticketEvent.Venue}</div>\r\n                " +
                                                $"<div style=\"padding: 3px 0 0 5px; font-size: 10px;\">No Refunds or Exchanges</div>\r\n            " +
                                            $"</td>\r\n            " +
                                            $"<td width=\"100\" valign=\"top\">\r\n  " +
                                                $"<div id=\"barcode\" style=\"padding: 5px 0 5px 0; max-width:100%;text-align: right;\">" +
                                                $"<img src=\"https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg\" /></div>              " +
                                                $"<div style=\"text-align: right; width: 100%; padding: 0 7px 0 0; font-size: 16px;\">" +
                                                $"<b>${ticket.Price}</b></div>\r\n                " +
                                                $"<div style=\"text-align: right; width: 100%; padding: 2px 7px 0 0; font-size: 12px;\">{ticket.Id}</div>\r\n            " +
                                            $"</td>\r\n            " +
                                        $"</tr>\r\n        " +
                                    $"</table>\r\n    " +
                                $"</div>\r\n" +
                            $"</body>\r\n" +
                            $"</html>";

                        await _emailSender.SendEmailAsync(email, subject, htmlMessage);
                    }
                }
                else
                {
                    // Unexpected event type
                    Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
                }
                return Ok();
            }
            catch (StripeException e)
            {
                Console.WriteLine("Errore Stripe: " + e.Message);
                return BadRequest();
            }
        }
    }
}
