using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatiDestekAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddImageToReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Reports");
        }
    }
}
