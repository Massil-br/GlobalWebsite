package models

import (
	"time"
)

type ClickerGameSave struct {
	Model

	UserID            uint    `json:"userId"`
	Golds             float64 `gorm:"default:0" json:"golds"`
	Level             int     `gorm:"default:1" json:"level"`
	Step              int     `gorm:"default:1" json:"step"`
	ClickLevel        int     `gorm:"default:1" json:"clickLevel"`
	ClickDamage       float64 `gorm:"default:1" json:"clickDamage"`
	AutoHuntGrokLevel int     `gorm:"default:0" json:"autoHuntGrokLevel"`
	AutoHuntGrokDPS   float64 `gorm:"default:0" json:"autoHuntGrokDps"`
}

type ClickerGameStats struct {
	Model

	UserID           uint          `json:"userId"`
	TotalGoldsEarned float64       `json:"totalGoldsEarned"`
	TotalClicks      uint          `json:"totalClicks"`
	TotalPlayedTime  time.Duration `json:"totalPlayedTime"`
}

type ClickerMonster struct {
	Model
	Name        string  `json:"name"`
	GoldMinDrop float64 `json:"goldMinDrop"`
	GoldMaxDrop float64 `json:"goldMaxDrop"`
	MinHp       float64 `json:"minHp"`
	MaxHp       float64 `json:"maxHp"`
	Level       uint    `json:"level"`
}

type ActualMonster struct {
	UserID   uint    `gorm:"primaryKey" json:"userId"` 
	Name     string  `json:"name"`
	GoldDrop float64 `json:"goldDrop"`
	MaxHp    float64 `json:"maxHp"`
	Hp       float64 `json:"hp"`
	Level    uint    `json:"level"`
}