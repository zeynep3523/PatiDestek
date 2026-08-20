using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatiDestekAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPriorityLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Reports",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Reports");
        }
    }
}
