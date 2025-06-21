package controllers

import (
	"errors"
	"net/http"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
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

type CreateMonsterReq struct {
	Name        string  `json:"name"`
	GoldMinDrop float64 `json:"goldMinDrop"`
	GoldMaxDrop float64 `json:"goldMaxDrop"`
	MinHp       float64 `json:"minHp"`
	MaxHp       float64 `json:"maxHp"`
	Level       uint    `json:"level"`
}

func CreateClickerMonster(c echo.Context) error {
	var req CreateMonsterReq

	err := c.Bind(&req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input"})
	}

	if req.GoldMaxDrop < 0 || req.GoldMinDrop < 0 || req.MinHp < 0 || req.MaxHp < 0 || req.Level <= 0 {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input, can't bind negative stats"})
	}

	if req.GoldMinDrop > req.GoldMaxDrop {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input, goldMinDrop must be lower than GoldMaxDrop"})
	}

	if req.MinHp > req.MaxHp {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input, minHp must be lower than maxHp"})
	}
	var existingMonster models.ClickerMonster
	err = config.DB.Where("name = ?", req.Name).First(&existingMonster).Error
	if err == nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Monster name already used"})
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Database error"})
	}

	monster := models.ClickerMonster{
		Name:        req.Name,
		GoldMinDrop: req.GoldMinDrop,
		GoldMaxDrop: req.GoldMaxDrop,
		MinHp:       req.MinHp,
		MaxHp:       req.MaxHp,
		Level:       req.Level,
	}

	err = config.DB.Create(&monster).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Could not create monster"})
	}

	return c.JSON(http.StatusCreated, echo.Map{"message": "Monster created successfully"})

}



