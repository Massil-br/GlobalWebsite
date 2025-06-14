package main

import (
	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/routes"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {

	config.Init()

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	routes.InitRoutes(e)

	e.Logger.Fatal(e.Start(":8081"))

}
