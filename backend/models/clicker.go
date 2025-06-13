package models

import "gorm.io/gorm"

type ClickerGameSave struct {
	gorm.Model

	UserID            uint    `json:"userId"`
	Golds             float64 `gorm:"default:0" json:"golds"`
	Level             int     `gorm:"default:1" json:"level"`
	ClicLevel         int     `gorm:"default:1" json:"clicLevel"`
	ClicDamage        float64 `gorm:"default:1" json:"clicDamage"`
	AutoHuntGrokLevel int     `gorm:"default:0" json:"autoHuntGrokLevel"`
	AutoHuntGrokDPS   float64 `gorm:"default:0" json:"autoHuntGrokDps"`
}
