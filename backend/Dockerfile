FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY DeliverySystem.Domain/DeliverySystem.Domain.csproj DeliverySystem.Domain/
COPY DeliverySystem.Application/DeliverySystem.Application.csproj DeliverySystem.Application/
COPY DeliverySystem.Infrastructure/DeliverySystem.Infrastructure.csproj DeliverySystem.Infrastructure/
COPY DeliverySystem.Api/DeliverySystem.Api.csproj DeliverySystem.Api/

RUN dotnet restore DeliverySystem.Api/DeliverySystem.Api.csproj

COPY . .
RUN dotnet publish DeliverySystem.Api/DeliverySystem.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "DeliverySystem.Api.dll"]
