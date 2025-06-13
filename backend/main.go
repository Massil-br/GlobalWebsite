package main

import (
	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/routes"
	"github.com/labstack/echo/v4"
)

func main() {

	config.Init()

	e := echo.New()

	routes.InitRoutes(e)

	e.Logger.Fatal(e.Start(":8081"))

}
