FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/DeliverySystem.Domain/DeliverySystem.Domain.csproj backend/DeliverySystem.Domain/
COPY backend/DeliverySystem.Application/DeliverySystem.Application.csproj backend/DeliverySystem.Application/
COPY backend/DeliverySystem.Infrastructure/DeliverySystem.Infrastructure.csproj backend/DeliverySystem.Infrastructure/
COPY backend/DeliverySystem.Api/DeliverySystem.Api.csproj backend/DeliverySystem.Api/

RUN dotnet restore backend/DeliverySystem.Api/DeliverySystem.Api.csproj

COPY backend/ ./backend/
RUN dotnet publish backend/DeliverySystem.Api/DeliverySystem.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "DeliverySystem.Api.dll"]
