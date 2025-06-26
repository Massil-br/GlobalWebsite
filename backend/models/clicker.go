package models

import (
	"time"
)

type ClickerGameSave struct {
	Model
	UserID               uint                 `json:"userId"`
	Golds                float64              `gorm:"default:0" json:"golds"`
	Level                uint                 `gorm:"default:1" json:"level"`
	Step                 uint                 `gorm:"default:1" json:"step"`
	ClickLevel           uint                 `gorm:"default:1" json:"clickLevel"`
	ClickDamage          float64              `gorm:"default:1" json:"clickDamage"`
	ClickerPassiveAllies []ClickerPassiveAlly `json:"clickerPassiveAllies" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type ClickerPassiveAllyModel struct {
	Model
	Name        string  `json:"name"`
	BaseDps     float64 `json:"baseDps"`
	BasePrice   float64 `json:"basePrice"`
	Description string  `json:"description"`
}

type ClickerPassiveAlly struct {
	Model
	ClickerPassiveAllyModelID uint                    `json:"modelId"`
	ClickerPassiveAllyModel   ClickerPassiveAllyModel `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ClickerGameSaveID         uint                    `json:"clickerGameSaveId"`
	ClickerGameSave           ClickerGameSave         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Name                      string                  `json:"name"`
	Dps                       float64                 `gorm:"default:0" json:"dps"`
	Level                     uint                    `gorm:"default:0" json:"level"`
	Description               string                  `json:"description"`
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

type Shop struct {
	Model
	ClickerGameSaveId uint            `json:"clickerGameSaveId" gorm:"index:idx_save_target,unique"`
	ClickerGameSave   ClickerGameSave `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Name              string          `json:"name"`
	Description       string          `json:"description"`
	Price             float64         `json:"price"`
	Level             uint            `json:"level" gorm:"default:0"`
	Target            string          `json:"target" gorm:"index:idx_save_target,unique"`
}
