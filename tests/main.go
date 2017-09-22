package main

import "fmt"

func main() {

	readConfig()
	fmt.Println(config)
	readUsers()
	fmt.Println(users)

	user := signup(users[0])
	user = login(users[0])
	fmt.Println(user)
}
