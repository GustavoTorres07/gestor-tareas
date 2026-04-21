using GestorTareasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GestorTareasAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TaskState> TaskStates { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<TaskState>().ToTable("TaskStates");
            modelBuilder.Entity<TaskItem>().ToTable("Tasks");

        }
    }
}