using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;

namespace SMS.Authentication {
public enum PasswordStatus
{
    Error = -1,
    UserNotFound = 0,
    Success = 1,
    FirstTimeLogin = 2,
    AlreadyLogedIn = 3,
    PsdExpired = 9,
    PsdExpireToday = 10,
    PsdExpiresTomorrow = 11,
    PsdExpiresInTwoDays = 12,
    PsdExpiresInThreeDays = 13,
    ChangePassword = 20,
    PasswordIncorrect = 5,
    UsernameIncorrect = 4
}


public class PasswordStatusRequirement : IAuthorizationRequirement
{
    public PasswordStatus Status { get; }

    public PasswordStatusRequirement(PasswordStatus status)
    {
        Status = status;
    }
}

public class PasswordStatusRequirementHandler : AuthorizationHandler<PasswordStatusRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PasswordStatusRequirement requirement)
    {
        if (!context.User.HasClaim(c => c.Type == MyClaimTypes.PasswordStatus))
            return Task.CompletedTask;

        var passwordStatus = (PasswordStatus)Convert.ToInt32(
                context.User
                .FindFirst(c => c.Type == MyClaimTypes.PasswordStatus)
                .Value);

        if (passwordStatus == requirement.Status)
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
    }
}