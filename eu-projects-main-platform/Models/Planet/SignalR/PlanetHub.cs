using eu_projects_main_platform.Models.Planet.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace eu_projects_main_platform.Models.Planet.SignalR
{
    [Authorize]
    public class PlanetHub:Hub
    {
        public async Task<GroupAssignmentResponse> AssignToGroup(string groupName)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                return new GroupAssignmentResponse()
                {
                    IsSuccess = true
                };
            }
            catch
            {
                return new GroupAssignmentResponse()
                {
                    IsSuccess = false,
                    ErrorMessage = "SignalR failed to assign the user to the requested group"
                };
            }
        }
        public async Task<GroupAssignmentResponse> RemoveFromGroup(string groupName)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
                return new GroupAssignmentResponse()
                {
                    IsSuccess = true
                };
            }
            catch
            {
                return new GroupAssignmentResponse()
                {
                    IsSuccess = false,
                    ErrorMessage = "SignalR failed to remove the user from the requested group"
                };
            }
        }
        public override async Task OnConnectedAsync()
        {
            var username = Context.GetUserName();
            await new ConnectionsTracker().UserConnected(username, Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.GetUserName();
            await new ConnectionsTracker().UserDisconnected(username, Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }

    }
}
