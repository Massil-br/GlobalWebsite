package controllers

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/Massil-br/GlobalWebsite/backend/utils"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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

func GetClickerMonster(c echo.Context) error {
	user := c.Get("user").(*models.User)

	var ActualMonster models.ActualMonster

	err := config.DB.Where("user_id = ?", user.ID).First(&ActualMonster).Error
	if err == nil && ActualMonster.Hp > 0 {
		return c.JSON(http.StatusOK, ActualMonster)
	}

	var clickerGameSave models.ClickerGameSave

	err = config.DB.Where("user_id = ?", user.ID).First(&clickerGameSave).Error
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "can't get user game save"})
	}

	clickerGameSave.Step++
	if clickerGameSave.Step >= 10 {
		clickerGameSave.Level++
		clickerGameSave.Step = 1
	}

	var monsterList []models.ClickerMonster

	err = config.DB.Where("level = ?", clickerGameSave.Level).Find(&monsterList).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": fmt.Sprintf("can't find monsters for level : %d", clickerGameSave.Level)})
	}

	if len(monsterList) == 0 {
		return c.JSON(http.StatusNotFound, echo.Map{"error": fmt.Sprintf("can't find monsters for level : %d", clickerGameSave.Level)})
	}

	num := rand.Intn(len(monsterList))
	monsterModel := monsterList[num]

	monster := models.ActualMonster{
		UserID:   user.ID,
		Name:     monsterModel.Name,
		GoldDrop: utils.Float64Between(monsterModel.GoldMinDrop, monsterModel.GoldMaxDrop),
		MaxHp:    utils.Float64Between(monsterModel.MinHp, monsterModel.MaxHp),
		Level:    monsterModel.Level,
	}
	monster.Hp = monster.MaxHp

	err = config.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}}, // PRIMARY KEY
		DoUpdates: clause.AssignmentColumns([]string{"name", "gold_drop", "max_hp", "hp", "level"}),
	}).Create(&monster).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to create/update monster"})
	}

	return c.JSON(http.StatusOK, monster)
}

func Click(c echo.Context) error {
	user := c.Get("user").(*models.User)

	tx := config.DB.Begin()
	if tx.Error != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to start transaction"})
	}

	var save models.ClickerGameSave

	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", user.ID).First(&save).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user save not found"})
	}

	var stats models.ClickerGameStats
	err = tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", user.ID).First(&stats).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user stats not found"})
	}

	var monster models.ActualMonster
	err = tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", user.ID).First(&monster).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusNotFound, echo.Map{"error": "actual monster not found"})
	}

	monster.Hp -= save.ClickDamage
	if monster.Hp < 0 {
		monster.Hp = 0
	}

	if monster.Hp == 0 {
		save.Golds += monster.GoldDrop
		stats.TotalGoldsEarned += monster.GoldDrop
	}

	stats.TotalClicks++

	err = tx.Save(&save).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to update save"})
	}

	err = tx.Save(&stats).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to update stats"})
	}

	err = tx.Save(&monster).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to update monster"})
	}

	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to commit transaction"})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "click damage success"})
}

func AutoHunt(c echo.Context) error {
	user := c.Get("user").(*models.User)

	tx := config.DB.Begin()
	if tx.Error != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to start transaction"})
	}

	var monster models.ActualMonster
	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", user.ID).First(&monster).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusNotFound, echo.Map{"error": "actual monster not found"})
	}

	var save models.ClickerGameSave
	err = tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", user.ID).First(&save).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user clicker save not found"})
	}

	var stats models.ClickerGameStats
	err = tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", user.ID).First(&stats).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user clicker stats not found"})
	}

	err = tx.Preload("ClickerPassiveAllies").Clauses(clause.Locking{Strength: "UPDATE"}).
    Where("user_id = ?", user.ID).
    First(&save).Error

	if err != nil{
		c.JSON(http.StatusInternalServerError, echo.Map{"error":"can't Preload ClickerPassiveAllies"})
	}

	var totalDps float64
	totalDps = 0
	alliesNum := len(save.ClickerPassiveAllies)

	if alliesNum > 0 {
		for i := 0; i < len(save.ClickerPassiveAllies); i++ {
			totalDps += save.ClickerPassiveAllies[i].Dps
		}
	}

	monster.Hp -= totalDps

	if monster.Hp < 0 {
		monster.Hp = 0
	}

	if monster.Hp == 0 {
		save.Golds += monster.GoldDrop
		stats.TotalGoldsEarned += monster.GoldDrop
	}

	stats.TotalPlayedTime += time.Second

	

	err = tx.Save(&save).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to update save"})
	}

	err = tx.Save(&stats).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to update stats"})
	}

	err = tx.Save(&monster).Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to update monster"})
	}

	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to commit transaction"})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "auto hunt  damage success"})

}

func GetClickerMonsterModels(c echo.Context) error {
	var monsterModels []models.ClickerMonster

	err := config.DB.Find(&monsterModels).Error
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Couldn't find monster models list"})
	}

	return c.JSON(http.StatusOK, monsterModels)

}

type CreateAllyModelReq struct {
	Name        string  `json:"name"`
	BaseDps     float64 `json:"baseDps"`
	BasePrice   float64 `json:"basePrice"`
	Description string  `json:"description"`
}

func CreateAllyModel(c echo.Context) error {
	var req CreateAllyModelReq
	err := c.Bind(&req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid Input"})
	}

	if req.Name == "" || req.BaseDps <= 0 || req.Description == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Base dps must be at least 1, name & description must be not empty"})
	}

	allyModel := models.ClickerPassiveAllyModel{
		Name:        req.Name,
		BaseDps:     req.BaseDps,
		BasePrice: 	 req.BasePrice,
		Description: req.Description,
	}

	err = config.DB.Create(&allyModel).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Coudn't create ally model"})
	}

	return c.JSON(http.StatusCreated, echo.Map{"message": "ClickerAllyModel created"})
}

func GetShops(c echo.Context) error {
	save := c.Get("clickerGameSave").(*models.ClickerGameSave)

	var shops []models.Shop

	err := config.DB.Where("clicker_game_save_id = ?", save.ID).Find(&shops).Error
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Couldn't find shops"})
	}
	return c.JSON(http.StatusOK, shops)

}

type UpgradeReq struct {
	Quantity     uint `json:"quantity"`
	TargetShopId uint `json:"targetShopId"`
}

func Upgrade(c echo.Context) error {

	var req UpgradeReq

	err := c.Bind(&req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid Input"})
	}

	if req.Quantity <= 0 {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input, quantity must be higher than 0"})
	}

	var shop models.Shop

	err = config.DB.Where("id = ?", req.TargetShopId).First(&shop).Error

	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Can't find targeted shop"})
	}

	save := c.Get("clickerGameSave").(*models.ClickerGameSave)

	priceToPay := shop.Price * float64(req.Quantity)

	if save.Golds < priceToPay {
		return c.JSON(http.StatusForbidden, echo.Map{"error": "You don't have enough money to buy this upgrade(s)"})
	}

	if shop.Target == "clicker" {
		save.Golds -= priceToPay
		save.ClickDamage *= 1.5 * float64(req.Quantity)
		save.ClickLevel++
		shop.Price *= 1.15 * float64(req.Quantity)
		shop.Level++

	} else {
		for _, ally := range save.ClickerPassiveAllies {
			if ally.Name == shop.Target {
				save.Golds -= priceToPay
				if ally.Level == 0 {
					ally.Dps += ally.ClickerPassiveAllyModel.BaseDps

				} else {
					ally.Dps *= 1.5 * float64(req.Quantity)
				}
				ally.Dps *= 1.5 * float64(req.Quantity)
				shop.Price *= 1.15 * float64(req.Quantity)
				ally.Level++
				shop.Level++

				err = config.DB.Save(&ally).Error
				if err != nil {
					return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to update ally"})
				}

				break
			}
		}
	}

	err = config.DB.Save(&save).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to update save"})
	}

	err = config.DB.Save(&shop).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to update shop"})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"save": save,
		"shop": shop,
	})

}

func GetClickerAllyModels(c echo.Context) error {
	var allyModels []models.ClickerPassiveAllyModel

	err := config.DB.Find(&allyModels).Error
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Can't find allyModelsList"})
	}

	return c.JSON(http.StatusOK, allyModels)

}
