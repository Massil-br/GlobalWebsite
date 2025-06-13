package controllers

import (
	"net/http"
	"strconv"

	"github.com/Massil-br/GlobalWebsite/backend/config"
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
)

func ResetGameById(c echo.Context) error {
	idParam := c.Param("id")
	game := c.Param("game")
	if idParam == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "User ID is required"})
	}

	id64, _ := strconv.ParseUint(idParam, 10, 64)
	id := uint(id64)

	user := c.Get("user").(*models.User)

	if user.ID != id && user.Role != "admin" {
		return c.JSON(http.StatusUnauthorized, "you cannot reset an account that isn't yours, only admins can do that")
	}
	var err error

	switch game {
	case "clicker":
		err = config.DB.Unscoped().Where("user_id = ?", id).Delete(&models.ClickerGameSave{}).Error
	// case "snake":
	// 	err = config.DB.Unscoped().Where("user_id = ?", id).Delete(&models.SnakeGameSave{}).Error

	default:
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Unknown game type"})
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to reset " + game + " save"})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "ClickerGameSave reset successfully"})
}
