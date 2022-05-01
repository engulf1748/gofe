#!/bin/sh

killp() {
	# Caveat: the API server binary must contain 'gofe' and `public/`'s
	# parent directory must be named 'gofe'
	# pgrep result:
	# ./gofe_2022-04-26T00:01:29-05:00
	# /bin/sh -c /home/neo/gofe/public/node_modules/.bin/next start
	# /usr/bin/node /home/neo/gofe/public/node_modules/.bin/next start
	kill -9 $(pgrep -f gofe) > /dev/null  2>&1 # -f looks at the full command line
	pm2 delete 0
}

deploy() {
	for op in "$@"
	do
		case "$op" in
		"-p")
			git pull || return
			;;
		esac
	done
	ls | grep -i "opensearch-template" > /dev/null 2>&1
	if [ $? -ne 0 ]
	then
		echo "Are you sure you're in the right directory? Exiting . . ."
		return
	fi
	echo "Beginning deployment . . ."
	d="$(date --iso-8601=seconds)"
	gd="gofe_$d"
	go build -o "$gd" . || return
	echo "API server build successful . . ."
	cd public/
	yarn next build || return
	echo "public/ build successful . . ."
	killp
	echo "Killed previous build's processes, if any . . ."
	pm2 --name GOFE-FRONT-END start yarn -- start & # || return does not seem to work after '&'
	echo "Front-end server launched . . ."
	cd ../
	./"$gd" &
	echo "API server launched . . ."
	echo "Gofë has been deployed . . ."
}

deploy "$@"
