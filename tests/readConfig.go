package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type Config struct {
	Url string `json:"url"`
}

var config Config

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Token    string `json:"token"`
}

var users []User

func readUsers() {
	file, e := ioutil.ReadFile("users.json")
	if e != nil {
		fmt.Println("error:", e)
	}
	content := string(file)
	json.Unmarshal([]byte(content), &users)
}
func readConfig() {
	file, e := ioutil.ReadFile("config.json")
	if e != nil {
		fmt.Println("error:", e)
	}
	content := string(file)
	json.Unmarshal([]byte(content), &config)
}
