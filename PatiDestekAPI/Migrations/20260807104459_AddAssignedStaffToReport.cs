using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PatiDestekAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignedStaffToReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedStaffId",
                table: "Reports",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_AssignedStaffId",
                table: "Reports",
                column: "AssignedStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Users_AssignedStaffId",
                table: "Reports",
                column: "AssignedStaffId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Users_AssignedStaffId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_AssignedStaffId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "AssignedStaffId",
                table: "Reports");
        }
    }
}
