package models

import (
	"time"

	"gorm.io/gorm"
)

type ClickerGameSave struct {
	gorm.Model

	UserID            uint    `json:"userId"`
	Golds             float64 `gorm:"default:0" json:"golds"`
	Level             int     `gorm:"default:1" json:"level"`
	Step              int     `gorm:"default:1" json:"step"`
	ClicLevel         int     `gorm:"default:1" json:"clicLevel"`
	ClicDamage        float64 `gorm:"default:1" json:"clicDamage"`
	AutoHuntGrokLevel int     `gorm:"default:0" json:"autoHuntGrokLevel"`
	AutoHuntGrokDPS   float64 `gorm:"default:0" json:"autoHuntGrokDps"`
}

type ClickerGameStats struct {
	gorm.Model

	UserID           uint      `json:"userId"`
	TotalGoldsEarned float64   `json:"totalGoldsEarned"`
	TotalClicks      uint      `json:"totalClicks"`
	TotalPlayedTime  time.Time `json:"totalPlayedTime"`
}
