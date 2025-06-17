package controllers

import (
	"net/http"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
)

func GetClickerPlayerSave(c echo.Context) error {
	// Récupère l'utilisateur depuis le contexte (déjà authentifié par JWTMiddleware)
	user := c.Get("user").(*models.User)
	var save models.ClickerGameSave

	err := config.DB.Where("user_id = ?", user.ID).First(&save).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Erreur lors de la récupération de la sauvegarde du clicker"})
	}

	return c.JSON(http.StatusOK, save)
}

func GetClickerPlayerStats(c echo.Context) error {
	user := c.Get("user").(*models.User)
	var stats models.ClickerGameStats

	err := config.DB.Where("user_id", user.ID).First(&stats).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"error": "Erreur lors de la récupération des statistiques du clicker",
		})
	}

	return c.JSON(http.StatusOK, stats)
}
