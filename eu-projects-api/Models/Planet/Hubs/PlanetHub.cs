using Microsoft.AspNetCore.SignalR;

namespace eu_projects_api.Models.Planet.Hubs
{
    public class PlanetHub : Hub
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
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
