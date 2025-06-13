package routes

import (
	"github.com/Massil-br/GlobalWebsite/backend/controllers"
	"github.com/Massil-br/GlobalWebsite/backend/middleware"
	"github.com/labstack/echo/v4"
)

func InitRoutes(e *echo.Echo) {
	InitGetRoutes(e)
	InitPostRoutes(e)
	InitDeleteRoutes(e)

}

func InitGetRoutes(e *echo.Echo) {
	e.GET("/", controllers.MainPage)
	e.GET("/users", controllers.GetAllUsers)
	e.GET("users/:id", controllers.GetUserById)

	e.GET("/logged", controllers.LoggedTest,
		middleware.JWTMiddleware,
		middleware.RoleMiddleware("user"),
	)
}

func InitPostRoutes(e *echo.Echo) {
	e.POST("/register", controllers.CreateUser)
	e.POST("/login", controllers.Login)
}

func InitDeleteRoutes(e *echo.Echo) {
	e.DELETE("/users/:id", controllers.DeleteUserById)
}
