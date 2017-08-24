package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

type LoginResp struct {
	Token string `json:"token"`
	User  User
}

func signup(user User) User {
	var loginResp LoginResp
	url := config.Url + "/signup"
	jsonStr, err := json.Marshal(user)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(jsonStr))
	b := strings.NewReader(string(jsonStr))
	req, _ := http.NewRequest("POST", url, b)
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(err)
	}
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	json.Unmarshal([]byte(body), &loginResp)

	fmt.Println("token: " + loginResp.Token)
	user.Token = loginResp.Token
	return user
}
func login(user User) User {
	var loginResp LoginResp
	url := config.Url + "/login"
	jsonStr, err := json.Marshal(user)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(jsonStr))
	b := strings.NewReader(string(jsonStr))
	req, _ := http.NewRequest("POST", url, b)
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(err)
	}
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	json.Unmarshal([]byte(body), &loginResp)

	fmt.Println("token: " + loginResp.Token)
	user.Token = loginResp.Token
	return user
}

func addTravel(user User, travel Travel) (User, Travel) {
	var loginResp LoginResp
	url := config.Url + "/login"
	jsonStr, err := json.Marshal(user)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(jsonStr))
	b := strings.NewReader(string(jsonStr))
	req, _ := http.NewRequest("POST", url, b)
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(err)
	}
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	json.Unmarshal([]byte(body), &loginResp)

	fmt.Println("token: " + loginResp.Token)
	user.Token = loginResp.Token
	return user
}
