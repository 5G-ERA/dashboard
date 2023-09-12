#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
# eu-projects-main-platform/
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["eu-projects-main-platform/eu-projects-main-platform.csproj", "eu-projects-main-platform/"]
RUN dotnet restore "eu-projects-main-platform/eu-projects-main-platform.csproj"
COPY . .
WORKDIR "/src/eu-projects-main-platform"
RUN dotnet build "eu-projects-main-platform.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "eu-projects-main-platform.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "eu-projects-main-platform.dll"]
