using System;
using Application.Activities.Commands;
using Application.Activities.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;

public class EditActivityValidator : BaseActivityValidator<EditActivity.Command, EditActivityDto>
{
  public EditActivityValidator() : base(x => x.ActivityDto)
  {
    RuleFor(x => x.ActivityDto.Id)
      .NotEmpty().WithMessage("Activity Id is required");

    // RuleFor(x => x.ActivityDto.Title)
    //   .NotEmpty().WithMessage("Title is required")
    //   .MaximumLength(100).WithMessage("Title must not exceed 100 characters");

    // RuleFor(x => x.ActivityDto.Date)
    //   .NotEmpty().WithMessage("Date is required")
    //   .GreaterThan(DateTime.UtcNow).WithMessage("Date must be in the future");

    // RuleFor(x => x.ActivityDto.Description)
    //   .NotEmpty().WithMessage("Description is required")
    //   .MaximumLength(500).WithMessage("Description must not exceed 500 characters");

    // RuleFor(x => x.ActivityDto.Category)
    //   .NotEmpty().WithMessage("Category is required")
    //   .MaximumLength(50).WithMessage("Category must not exceed 50 characters");

    // RuleFor(x => x.ActivityDto.City)
    //   .NotEmpty().WithMessage("City is required")
    //   .MaximumLength(50).WithMessage("City must not exceed 50 characters");

    // RuleFor(x => x.ActivityDto.Venue)
    //   .NotEmpty().WithMessage("Venue is required")
    //   .MaximumLength(100).WithMessage("Venue must not exceed 100 characters");
  }
}
