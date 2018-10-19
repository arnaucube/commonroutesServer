# assuming that mongodb is running and npm installs are performed

SESSION='CommonRoutes'

tmux new-session -d -s $SESSION
tmux split-window -d -t 0 -v
tmux split-window -d -t 1 -h
tmux split-window -d -t 0 -h


tmux send-keys -t 0 'cd goImgServer && ./goImgServer' enter
tmux send-keys -t 1 'cd commonroutesServer && npm start' enter
# tmux send-keys -t 1 'cd commonroutesServer && forever start server.js' enter

tmux send-keys -t 2 'cd commonroutesLandingPage && node webserver.js' enter
# tmux send-keys -t 2 'cd commonroutesLandingPage && forever start webserver.js' enter
tmux send-keys -t 3 'cd commonroutesBot && npm start' enter

tmux attach
