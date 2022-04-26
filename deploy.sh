#!/bin/sh

killp() {
        kill -9 $(pgrep gofe) > /dev/null  2>&1
        kill -9 $(pgrep node) > /dev/null  2>&1 # Not 'strictly', but let us go with it
}

deploy() {
	git pull || return
	ls | grep -i "opensearch-template" > /dev/null 2>&1
	if [ $? -ne 0 ]
	then
		echo "Are you sure you're in the right directory? Exiting . . ."
		return
	fi
	echo "Beginning deployment . . ."
	killp
	echo "Killed previous processes, if any . . ."
	cd public/
	yarn next build || return
	echo "public/ build successful . . ."
	yarn next start & # || return does not seem to work after '&'
	echo "Front-end started . . ."
	cd ../
	go build . || return
	echo "Go server build successful . . ."
	./gofe &
	echo "Gofë has been deployed . . ."
}

deploy
