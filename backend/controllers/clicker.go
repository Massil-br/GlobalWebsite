package controllers

import (
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetClickerStats(c echo.Context) error {
	// Récupère l'utilisateur depuis le contexte (déjà authentifié par JWTMiddleware)
	user := c.Get("user").(*models.User)

	return c.JSON(http.StatusOK, echo.Map{
		"username": user.Username,
		"gameSave": user.ClickerGameSave,
	})
}
