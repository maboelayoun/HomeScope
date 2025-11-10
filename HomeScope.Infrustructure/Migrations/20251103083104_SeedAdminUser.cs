using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeScope.Infrustructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Phone", "Role" },
                values: new object[] { 1, new DateTime(2025, 11, 3, 8, 31, 2, 143, DateTimeKind.Utc).AddTicks(9009), "admin@homescope.com", "System Admin", "$2a$11$OhrXAY2HwJniU5sHc0sAruW0dheMwAEjkY3cMEGFfXwVOQ1WtRnhi", "0000000000", "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
