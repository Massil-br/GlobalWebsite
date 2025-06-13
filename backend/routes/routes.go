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
	e.GET("/api", controllers.MainPage)
	e.GET("/api/users", controllers.GetAllUsers)
	e.GET("/api/users/:id", controllers.GetUserById)

	e.GET("/api/logged", controllers.LoggedTest,
		middleware.JWTMiddleware,
		middleware.RoleMiddleware("user"),
	)

	e.GET("/api/clicker", controllers.GetClickerStats,
		middleware.JWTMiddleware,
		middleware.RoleMiddleware("user"),
		middleware.EnsureClickerGameSave,
	)

}

func InitPostRoutes(e *echo.Echo) {
	e.POST("/api/register", controllers.CreateUser)
	e.POST("/api/login", controllers.Login)
}

func InitDeleteRoutes(e *echo.Echo) {
	e.DELETE("/api/users/:id", controllers.DeleteUserById)
	e.DELETE("/api/reset/:game/:id", controllers.ResetGameById, middleware.JWTMiddleware, middleware.RoleMiddleware("user"))

}
