#!/bin/sh

killp() {
        kill -9 $(pgrep gofe) > /dev/null  2>&1
        kill -9 $(pgrep node) > /dev/null  2>&1 # Not 'strictly', but let us go with it
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
	yarn next start & # || return does not seem to work after '&'
	echo "Front-end server launched . . ."
	cd ../
	./"$gd" &
	echo "API server launched . . ."
	echo "Gofë has been deployed . . ."
}

deploy "$@"
