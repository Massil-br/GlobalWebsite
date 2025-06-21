package controllers

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/Massil-br/GlobalWebsite/backend/utils"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func GetClickerPlayerSave(c echo.Context) error {
    val := c.Get("clickerGameSave")
    if val == nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Clicker game save not found in context"})
    }
    save, ok := val.(*models.ClickerGameSave)
    if !ok {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Invalid type for clickerGameSave"})
    }
    return c.JSON(http.StatusOK, save)
}

func GetClickerPlayerStats(c echo.Context) error {
    val := c.Get("clickerGameStats")
    if val == nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Clicker game stats not found in context"})
    }
    stats, ok := val.(*models.ClickerGameStats)
    if !ok {
        return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Invalid type for clickerGameStats"})
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

type Monster struct {
	Name        string  `json:"name"`
	GoldDrop    float64 `json:"goldDrop"`
	MaxHp		float64 `json:"maxHp"`
	Hp          float64 `json:"hp"`
	Level       uint    `json:"level"`
	
}

func GetClickerMonster(c echo.Context) error {
	user := c.Get("user").(*models.User)
	var clickerGameSave models.ClickerGameSave
	err := config.DB.Where("user_id = ?", user.ID).First(&clickerGameSave).Error
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "can't get user game save"})
	}
	var monsterList []models.ClickerMonster
	err = config.DB.Where("level = ?", clickerGameSave.Level).Find(&monsterList).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": fmt.Sprintf("can't find monsters for level : %d", clickerGameSave.Level)})
	}
	if len(monsterList) == 0{
		return c.JSON(http.StatusNotFound, echo.Map{"error": fmt.Sprintf("can't find monsters for level : %d", clickerGameSave.Level)})
	}
	num := rand.Intn(len(monsterList))
	monsterModel := monsterList[num]
	monster := Monster{
		Name: monsterModel.Name,
		GoldDrop: utils.Float64Between(monsterModel.GoldMinDrop, monsterModel.GoldMaxDrop),
		MaxHp: utils.Float64Between(monsterModel.MinHp, monsterModel.MaxHp),
		Level : monsterModel.Level,
	}
	monster.Hp = monster.MaxHp

	return c.JSON(http.StatusOK, monster)
}

