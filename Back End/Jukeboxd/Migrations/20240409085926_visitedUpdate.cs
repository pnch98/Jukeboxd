using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jukeboxd.Migrations
{
    /// <inheritdoc />
    public partial class visitedUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visited_Artists_ArtistId",
                table: "Visited");

            migrationBuilder.DropForeignKey(
                name: "FK_Visited_Users_UserId",
                table: "Visited");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Visited",
                table: "Visited");

            migrationBuilder.RenameTable(
                name: "Visited",
                newName: "VisitedList");

            migrationBuilder.RenameIndex(
                name: "IX_Visited_UserId",
                table: "VisitedList",
                newName: "IX_VisitedList_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Visited_ArtistId",
                table: "VisitedList",
                newName: "IX_VisitedList_ArtistId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VisitedList",
                table: "VisitedList",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VisitedList_Artists_ArtistId",
                table: "VisitedList",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VisitedList_Users_UserId",
                table: "VisitedList",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VisitedList_Artists_ArtistId",
                table: "VisitedList");

            migrationBuilder.DropForeignKey(
                name: "FK_VisitedList_Users_UserId",
                table: "VisitedList");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VisitedList",
                table: "VisitedList");

            migrationBuilder.RenameTable(
                name: "VisitedList",
                newName: "Visited");

            migrationBuilder.RenameIndex(
                name: "IX_VisitedList_UserId",
                table: "Visited",
                newName: "IX_Visited_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_VisitedList_ArtistId",
                table: "Visited",
                newName: "IX_Visited_ArtistId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Visited",
                table: "Visited",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Visited_Artists_ArtistId",
                table: "Visited",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Visited_Users_UserId",
                table: "Visited",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
