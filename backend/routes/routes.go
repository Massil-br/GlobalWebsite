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
	InitPutRoutes(e)

}

func InitGetRoutes(e *echo.Echo) {
	e.GET("/api", controllers.MainPage)
	e.GET("/api/users", controllers.GetAllUsers)
	e.GET("/api/users/:id", controllers.GetUserById)

	e.GET("/api/logged", controllers.LoggedTest,

		middleware.AuthMiddleware("user"),
	)

	e.GET("/api/clicker/getClickerSave", controllers.GetClickerPlayerSave,
		middleware.AuthMiddleware("user"),
		middleware.EnsureClickerGameSaveExists,
	)
	e.GET("/api/clicker/getClickerStats", controllers.GetClickerPlayerStats,
		middleware.AuthMiddleware("user"),
		middleware.EnsureClickerGameStatsExists,
	)
	e.GET("/api/clicker/getMonster", controllers.GetClickerMonster,
		middleware.AuthMiddleware("user"),
		middleware.EnsureClickerGameSaveExists,
		middleware.EnsureClickerGameStatsExists,
	)

	e.GET("/api/clicker/getMonsterModels", controllers.GetClickerMonsterModels, middleware.AuthMiddleware("admin"))
	e.GET("/api/clicker/getShops", controllers.GetShops, middleware.AuthMiddleware("user"), middleware.EnsureClickerGameSaveExists)
	e.GET("/api/clicker/getAllyModels", controllers.GetClickerAllyModels, middleware.AuthMiddleware("admin"), middleware.EnsureClickerGameSaveExists)
}

func InitPutRoutes(e *echo.Echo) {
	e.PUT("/api/clicker/click", controllers.Click,
		middleware.AuthMiddleware("user"),
		middleware.EnsureClickerGameSaveExists,
		middleware.EnsureClickerGameStatsExists,
	)
	e.PUT("/api/clicker/autoHunt", controllers.AutoHunt,
		middleware.AuthMiddleware("user"),
		middleware.EnsureClickerGameSaveExists,
		middleware.EnsureClickerGameStatsExists,
	)
}

func InitPostRoutes(e *echo.Echo) {
	e.POST("/api/register", controllers.CreateUser)
	e.POST("/api/login", controllers.Login)
	e.POST("/api/clicker/createMonster", controllers.CreateClickerMonster, middleware.AuthMiddleware("admin"))
	e.POST("/api/clicker/createAllyModel", controllers.CreateAllyModel, middleware.AuthMiddleware("admin"))
	e.POST("/api/clicker/upgrade", controllers.Upgrade, middleware.AuthMiddleware("user"), middleware.EnsureClickerGameSaveExists)
}

func InitDeleteRoutes(e *echo.Echo) {
	e.DELETE("/api/users/:id", controllers.DeleteUserById)
	e.DELETE("/api/reset/:game/:id", controllers.ResetGameById, middleware.AuthMiddleware("user"))
	//e.DELETE("/api/game/deleteAlly/:id", controllers.DeleteAllyModel, middleware.AuthMiddleware("admin"))
}
