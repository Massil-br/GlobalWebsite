package config

import (
	"fmt"
	"log"
	"os"

	"github.com/Massil-br/GlobalWebsite/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	db.AutoMigrate(
		&models.User{},
		&models.ClickerGameSave{},
		&models.ClickerGameStats{},
		&models.ClickerMonster{},
		&models.ActualMonster{},
		&models.ClickerPassiveAlly{},
		&models.ClickerPassiveAllyModel{},
		&models.Shop{},
	)
	DB = db
	log.Println("✅ Connected to the database")

}
