package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo"
)

func getTime(c echo.Context) error {
	return c.String(http.StatusOK, time.Now().Format(
		"Mon Jan 2 15:04:05 -0700 MST 2006"))
}

func main() {
	e := echo.New()
	e.Static("/", "app/build")
	e.GET("/waffle/time", getTime)
	e.Logger.Fatal(e.Start(":1323"))
}
