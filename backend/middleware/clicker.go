package middleware

import (
	"errors"
	"net/http"
	"sync"
	"time"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func EnsureClickerGameSaveExists(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user").(*models.User)

		var save models.ClickerGameSave

		err := config.DB.Preload("ClickerPassiveAllies.ClickerPassiveAllyModel").
			Where("user_id = ?", user.ID).
			First(&save).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			save = models.ClickerGameSave{UserID: user.ID}
			if err := config.DB.Create(&save).Error; err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "can't create save"})
			}
		} else if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Database error"})
		}

		var modelsList []models.ClickerPassiveAllyModel
		if err := config.DB.Find(&modelsList).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "error while finding alliesModels"})
		}

		existingModelIDs := make(map[uint]bool)
		for _, ally := range save.ClickerPassiveAllies {
			existingModelIDs[ally.ClickerPassiveAllyModelID] = true
		}

		// Prépare la liste des alliés manquants à créer
		var alliesToCreate []models.ClickerPassiveAlly
		for _, model := range modelsList {
			if !existingModelIDs[model.ID] {
				alliesToCreate = append(alliesToCreate, models.ClickerPassiveAlly{
					ClickerGameSaveID:         save.ID,
					ClickerPassiveAllyModelID: model.ID,
					Name:                      model.Name,
					Description:               model.Description,
				})
			}
		}

		if len(alliesToCreate) > 0 {
			if err := config.DB.Create(&alliesToCreate).Error; err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while creating missing allies"})
			}

			if err := config.DB.Preload("ClickerPassiveAllies.ClickerPassiveAllyModel").
				First(&save, save.ID).Error; err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "post-creation error"})
			}
		}

		var shop models.Shop

		err = config.DB.Where("clicker_game_save_id = ? AND target = ?", save.ID, "clicker").First(&shop).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newShop := models.Shop{
				ClickerGameSaveId: save.ID,
				Name:              "Shop clicker",
				Description:       "Upgrade of clicker",
				Price:             5,
				Level:             1,
				Target:            "clicker",
			}

			err := config.DB.Create(&newShop).Error
			if err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while creating clicker shop"})
			}
		} else if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while finding shops of clicker"})
		}

		for _, ally := range save.ClickerPassiveAllies {
			var shop models.Shop
			err := config.DB.Where("clicker_game_save_id = ? AND target = ?", save.ID, ally.Name).
				First(&shop).Error
			price := ally.ClickerPassiveAllyModel.BasePrice

			if errors.Is(err, gorm.ErrRecordNotFound) {

				newShop := models.Shop{
					ClickerGameSaveId: save.ID,
					Name:              "Shop " + ally.Name,
					Description:       "Upgrade of   " + ally.Name,
					Price:             price,
					Target:            ally.Name,
				}
				if err := config.DB.Create(&newShop).Error; err != nil {
					return c.JSON(http.StatusInternalServerError, echo.Map{"error": "error while creating shop for " + ally.Name})
				}

			} else if err != nil {
				return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while finding shops of " + ally.Name})
			}
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

var userCooldowns = make(map[uint]time.Time)
var cooldownMutex sync.Mutex

func CanUserHunt(userID uint) bool {
	cooldownMutex.Lock()
	defer cooldownMutex.Unlock()

	lastTime, exists := userCooldowns[userID]
	if !exists || time.Since(lastTime) >= 900*time.Millisecond {
		userCooldowns[userID] = time.Now()
		return true
	}
	return false
}
