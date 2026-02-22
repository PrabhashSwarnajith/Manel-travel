using ClosedXML.Excel;
using ManelTravel.API.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ManelTravel.API.Services
{
    public class ExportService
    {
        public byte[] ExportBookingsToPdf(List<Booking> bookings)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);

                    page.Header().Text("Manel Travel - Tour Package Booking Report")
                        .FontSize(20).Bold().FontColor(Colors.Blue.Darken3);

                    page.Content().PaddingVertical(10).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(30);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(1.5f);
                            columns.RelativeColumn(1);
                        });

                        // Header
                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Blue.Darken3).Padding(5).Text("#").FontColor(Colors.White).Bold();
                            header.Cell().Background(Colors.Blue.Darken3).Padding(5).Text("Customer").FontColor(Colors.White).Bold();
                            header.Cell().Background(Colors.Blue.Darken3).Padding(5).Text("Package").FontColor(Colors.White).Bold();
                            header.Cell().Background(Colors.Blue.Darken3).Padding(5).Text("Destination").FontColor(Colors.White).Bold();
                            header.Cell().Background(Colors.Blue.Darken3).Padding(5).Text("Date").FontColor(Colors.White).Bold();
                            header.Cell().Background(Colors.Blue.Darken3).Padding(5).Text("Price").FontColor(Colors.White).Bold();
                        });

                        // Rows
                        for (int i = 0; i < bookings.Count; i++)
                        {
                            var b = bookings[i];
                            var bg = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten4;

                            table.Cell().Background(bg).Padding(5).Text((i + 1).ToString());
                            table.Cell().Background(bg).Padding(5).Text(b.Customer != null ? $"{b.Customer.FirstName} {b.Customer.LastName}" : "N/A");
                            table.Cell().Background(bg).Padding(5).Text(b.Package?.PackageName ?? "N/A");
                            table.Cell().Background(bg).Padding(5).Text(b.Package?.Destination ?? "N/A");
                            table.Cell().Background(bg).Padding(5).Text(b.BookingDate.ToString("dd/MM/yyyy"));
                            table.Cell().Background(bg).Padding(5).Text($"LKR {b.Package?.Price:N2}");
                        }
                    });

                    page.Footer().AlignCenter()
                        .Text(t =>
                        {
                            t.Span("Generated on: ");
                            t.Span(DateTime.Now.ToString("dd/MM/yyyy HH:mm")).Bold();
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] ExportBookingsToExcel(List<Booking> bookings)
        {
            using var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Bookings");

            // Header
            ws.Cell(1, 1).Value = "#";
            ws.Cell(1, 2).Value = "Customer Name";
            ws.Cell(1, 3).Value = "Package Name";
            ws.Cell(1, 4).Value = "Destination";
            ws.Cell(1, 5).Value = "Duration (Days)";
            ws.Cell(1, 6).Value = "Start Date";
            ws.Cell(1, 7).Value = "Booking Date";
            ws.Cell(1, 8).Value = "Price (LKR)";
            ws.Cell(1, 9).Value = "Status";

            var header = ws.Range(1, 1, 1, 9);
            header.Style.Font.Bold = true;
            header.Style.Fill.BackgroundColor = XLColor.DarkBlue;
            header.Style.Font.FontColor = XLColor.White;

            for (int i = 0; i < bookings.Count; i++)
            {
                var b = bookings[i];
                ws.Cell(i + 2, 1).Value = i + 1;
                ws.Cell(i + 2, 2).Value = b.Customer != null ? $"{b.Customer.FirstName} {b.Customer.LastName}" : "N/A";
                ws.Cell(i + 2, 3).Value = b.Package?.PackageName ?? "N/A";
                ws.Cell(i + 2, 4).Value = b.Package?.Destination ?? "N/A";
                ws.Cell(i + 2, 5).Value = b.Package?.Duration ?? 0;
                ws.Cell(i + 2, 6).Value = b.Package?.StartDate.ToString("d") ?? "N/A";
                ws.Cell(i + 2, 7).Value = b.BookingDate.ToString("dd/MM/yyyy");
                ws.Cell(i + 2, 8).Value = b.Package?.Price ?? 0;
                ws.Cell(i + 2, 9).Value = b.Status;
            }

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public byte[] GenerateFlightTicket(FlightBooking booking)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var flight = booking.Flight;
            var passengers = booking.Passengers?.ToList() ?? new List<Passenger>();

            var document = Document.Create(container =>
            {
                foreach (var passenger in passengers)
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A5.Landscape());
                        page.Margin(20);

                        page.Content().Border(1).BorderColor(Colors.Grey.Lighten2).Column(col =>
                        {
                            // Header bar
                            col.Item().Background(Colors.Teal.Darken2).Padding(12).Row(row =>
                            {
                                row.RelativeItem().Text("✈  MANEL TRAVEL").FontSize(16).Bold().FontColor(Colors.White);
                                row.ConstantItem(120).AlignRight().Text("E-TICKET").FontSize(14).Bold().FontColor(Colors.White);
                            });

                            // Flight info
                            col.Item().PaddingHorizontal(16).PaddingVertical(10).Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text($"Flight: {flight?.FlightNumber ?? "N/A"}").FontSize(12).Bold();
                                    c.Item().Text($"Airline: {flight?.Airline ?? "N/A"}").FontSize(10).FontColor(Colors.Grey.Darken1);
                                });
                                row.RelativeItem().AlignRight().Column(c =>
                                {
                                    c.Item().Text($"Booking ID: #{booking.FlightBookingId}").FontSize(10);
                                    c.Item().Text($"Date: {booking.BookingDate:dd MMM yyyy}").FontSize(10).FontColor(Colors.Grey.Darken1);
                                });
                            });

                            // Route
                            col.Item().PaddingHorizontal(16).PaddingBottom(8).Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text("FROM").FontSize(8).FontColor(Colors.Grey.Darken1);
                                    c.Item().Text(flight?.Origin ?? "N/A").FontSize(14).Bold();
                                    c.Item().Text($"Departure: {flight?.DepartureTime:HH:mm dd MMM yyyy}").FontSize(9);
                                });
                                row.ConstantItem(40).AlignCenter().PaddingTop(10).Text("→").FontSize(18).Bold().FontColor(Colors.Teal.Darken2);
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text("TO").FontSize(8).FontColor(Colors.Grey.Darken1);
                                    c.Item().Text(flight?.Destination ?? "N/A").FontSize(14).Bold();
                                    c.Item().Text($"Arrival: {flight?.ArrivalTime:HH:mm dd MMM yyyy}").FontSize(9);
                                });
                            });

                            // Divider
                            col.Item().PaddingHorizontal(16).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                            // Passenger info
                            col.Item().PaddingHorizontal(16).PaddingVertical(8).Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text("PASSENGER").FontSize(8).FontColor(Colors.Grey.Darken1);
                                    c.Item().Text($"{passenger.FirstName} {passenger.Surname}").FontSize(12).Bold();
                                });
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text("PASSPORT").FontSize(8).FontColor(Colors.Grey.Darken1);
                                    c.Item().Text(string.IsNullOrEmpty(passenger.PassportNumber) ? "N/A" : passenger.PassportNumber).FontSize(12);
                                });
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text("CLASS").FontSize(8).FontColor(Colors.Grey.Darken1);
                                    c.Item().Text(flight?.Class ?? "Economy").FontSize(12);
                                });
                            });

                            // Footer
                            col.Item().Background(Colors.Grey.Lighten4).Padding(8).AlignCenter()
                                .Text($"Total Price: LKR {booking.TotalPrice:N2}  |  Status: {booking.Status}")
                                .FontSize(10).Bold().FontColor(Colors.Teal.Darken2);
                        });
                    });
                }
            });

            return document.GeneratePdf();
        }
    }
}
