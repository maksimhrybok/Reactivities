using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
  public required DbSet<Activity> Activities { get; set; }
  public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }
  public required DbSet<Photo> Photos { get; set; }
  public required DbSet<Comment> Comments { get; set; }
  public required DbSet<UserFollowing> UserFollowings { get; set; }

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);

    builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.ActivityId, a.UserId }));
    builder.Entity<ActivityAttendee>()
      .HasOne(u => u.User)
      .WithMany(a => a.Activities)
      .HasForeignKey(a => a.UserId);

    builder.Entity<ActivityAttendee>()
      .HasOne(u => u.Activity)
      .WithMany(a => a.Attendees)
      .HasForeignKey(a => a.ActivityId);

    builder.Entity<UserFollowing>(b =>
    {
      b.HasKey(k => new { k.ObserverId, k.TargetId });
      b.HasOne(u => u.Observer)
        .WithMany(f => f.Followings)
        .HasForeignKey(f => f.ObserverId)
        .OnDelete(DeleteBehavior.Cascade);

      b.HasOne(u => u.Target)
        .WithMany(f => f.Followers)
        .HasForeignKey(f => f.TargetId)
        .OnDelete(DeleteBehavior.NoAction);
    });

    var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
      v => v.ToUniversalTime(),
      v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

    foreach (var entityType in builder.Model.GetEntityTypes())
    {
      foreach (var property in entityType.GetProperties())
      {
        if (property.ClrType == typeof(DateTime))
        {
          property.SetValueConverter(dateTimeConverter);
        }
      }
    }
  }
}
