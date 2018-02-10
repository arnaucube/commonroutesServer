# simple bash script to run the system locally without Docker


SESSION='CommonRoutes_Dev'

tmux new-session -d -s $SESSION
tmux split-window -d -t 0 -v
tmux split-window -d -t 0 -h
tmux split-window -d -t 2 -h


tmux send-keys -t 0 'node server.js' enter
tmux send-keys -t 1 'cd ../commonroutesApp && ionic serve' enter
tmux send-keys -t 2 'cd ../commonroutesAdminWeb && http-server' enter

tmux attach
