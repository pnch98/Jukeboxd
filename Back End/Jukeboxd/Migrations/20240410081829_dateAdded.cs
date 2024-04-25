using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jukeboxd.Migrations
{
    /// <inheritdoc />
    public partial class dateAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JukeboxList");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
