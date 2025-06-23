using System;
using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
  public class Query : IRequest<Result<ActivityDto>>
  {
    public required string Id { get; set; }
  }

  public class Handler(AppDbContext context, IMapper mapper) :IRequestHandler<Query, Result<ActivityDto>>
  {
    public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
    {
      var activity = await context.Activities
      .Include(a => a.Attendees)
      .ThenInclude(a => a.User)
      .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);

      if (activity == null)
      {
        return Result<ActivityDto>.Failure("Activity not found", 404); 
      }

      return Result<ActivityDto>.Success(mapper.Map<ActivityDto>(activity)); 
    }
  }
}