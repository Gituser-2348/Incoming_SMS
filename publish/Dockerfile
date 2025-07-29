# Use .NET 7 ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
# Set the working directory in the container
WORKDIR /app
# Copy all published files to the container
COPY . .
# Expose default HTTP port
EXPOSE 80
# Run the application
ENTRYPOINT ["dotnet", "IncomingSMS.dll"]
