package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username        string          `json:"username"`
	Email           string          `json:"email" gorm:"unique"`
	Password        string          `json:"-"`
	Role            string          `json:"role"`
	ClickerGameSave ClickerGameSave `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
