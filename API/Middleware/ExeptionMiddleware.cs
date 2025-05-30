using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExeptionMiddleware : IMiddleware
{
  public async Task InvokeAsync(HttpContext context, RequestDelegate next)
  {
    try
    {
      await next(context);
    }
    catch(ValidationException ex)
    {
      await HandleValidationExceptionAsync(context, ex);
    }
    catch (Exception ex)
    {
      Console.WriteLine(ex);
    }
  }

  private static async Task HandleValidationExceptionAsync(HttpContext context, ValidationException ex)
  {
    var validationErrors = new Dictionary<string, string[]>();

    if (ex.Errors is not null)
    {
      foreach (var error in ex.Errors)
      {
        if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
        {
          validationErrors[error.PropertyName] = [.. existingErrors, error.ErrorMessage];
        }
        else
        {
          validationErrors[error.PropertyName] = [error.ErrorMessage];
        }
      }
    }
    context.Response.StatusCode = StatusCodes.Status400BadRequest;

    var validationProblemDetails = new ValidationProblemDetails(validationErrors)
    {
      Status = StatusCodes.Status400BadRequest,
      Title = "Validation Error",
      Type = "ValidationFailure",
      Detail = "One or more validation errors occurred."
    };

    await context.Response.WriteAsJsonAsync(validationProblemDetails);
  }
}
