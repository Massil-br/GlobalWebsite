package controllers

import (
	"github.com/Massil-br/GlobalWebsite/backend/models"
	"github.com/labstack/echo/v4"
)

func LoggedTest(c echo.Context) error {
	user := c.Get("user").(*models.User)

	return c.JSON(200, echo.Map{
		"message": "You are logged in!",
		"user":    user.Username,
		"role":    user.Role,
	})
}
