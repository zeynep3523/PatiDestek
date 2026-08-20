using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatiDestekAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignedByUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedByUserId",
                table: "Reports",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_AssignedByUserId",
                table: "Reports",
                column: "AssignedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Users_AssignedByUserId",
                table: "Reports",
                column: "AssignedByUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Users_AssignedByUserId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_AssignedByUserId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "AssignedByUserId",
                table: "Reports");
        }
    }
}
