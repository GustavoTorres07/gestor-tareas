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

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Estado)
                .WithMany()
                .HasForeignKey(t => t.IdEstado);

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Usuario)
                .WithMany()
                .HasForeignKey(t => t.IdUsuario);
        }
    }
}