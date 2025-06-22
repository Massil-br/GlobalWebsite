package middleware

import (
	"errors"
	"net/http"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func EnsureClickerGameSaveExists(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user").(*models.User)

		var save models.ClickerGameSave
		err := config.DB.Where("user_id = ?", user.ID).First(&save).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Si aucune sauvegarde, on en crée une par défaut
			save = models.ClickerGameSave{
				UserID:            user.ID,
				Golds:             0,
				Level:             1,
				Step:              0,
				ClickLevel:        1,
				ClickDamage:       1,
				AutoHuntGrokLevel: 0,
				AutoHuntGrokDPS:   0,
			}
			if err := config.DB.Create(&save).Error; err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Impossible de créer la sauvegarde"})
			}

		} else if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Erreur base de données"})
		}

		c.Set("clickerGameSave", &save)
		return next(c)
	}
}


func EnsureClickerGameStatsExists(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user").(*models.User)

		
		var stats models.ClickerGameStats
		err := config.DB.Where("user_id = ?", user.ID).First(&stats).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Si aucune sauvegarde, on en crée une par défaut
			stats = models.ClickerGameStats{
				UserID:           user.ID,
				TotalGoldsEarned: 0,
				TotalClicks:      0,
				TotalPlayedTime:  0,
			}
			if err := config.DB.Create(&stats).Error; err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Impossible de créer la sauvegarde"})
			}
		} else if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Erreur base de données"})
		}

		c.Set("clickerGameStats", &stats)
		return next(c)
	}
}
