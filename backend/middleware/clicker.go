package middleware

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func EnsureClickerGameSave(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user").(*models.User)

		var save models.ClickerGameSave
		err := config.DB.Where("user_id = ?", user.ID).First(&save).Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Crée une sauvegarde par défaut si pas trouvée
				save = models.ClickerGameSave{
					UserID:            user.ID,
					Golds:             0,
					Level:             1,
					ClicLevel:         1,
					ClicDamage:        1,
					AutoHuntGrokLevel: 0,
					AutoHuntGrokDPS:   0,
				}
				if err := config.DB.Create(&save).Error; err != nil {
					return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Impossible de créer la sauvegarde"})
				}
			} else {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Erreur base de données"})
			}
		}
		fmt.Println(save)
		// Injecte la sauvegarde dans le contexte
		c.Set("clickerGameSave", &save)

		return next(c)
	}
}
