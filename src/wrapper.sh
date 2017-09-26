#!/bin/bash

script="$1"
fd3="/dev/fd/3"

[ ! -e $fd3 ] && echo "DON'T RUN THIS DIRECTLY" && exit 2
[ -z "$script" ] && echo "DON'T RUN THIS DIRECTLY" && exit 2

. $WRAPPER_SOURCE/JSON.sh

getFromResponse() {
  echo "$jresponse" | grep "$1" | tr "\t" "\n" | head -n 2 | tail -n 1
}

sendMsg() {
  res=""
  for i in $(seq 1 "$(expr $# + 1)"); do
    [ ! -z "$res" ] && res="$res|"
    t=${!i//"|"/'\|'}
    res="$res$t"
  done
  retid="$RANDOM"
  res="$res$retid"
  echo "$res" 1>&3 #send
  read response #get
  jresponse=$(echo "$response" | tokenize | parse)
  err=$(getFromResponse "error")
  [ ! -z "$err" ] && echo "ERROR: $err"
}

header() {
  sendMsg "header" "$1" "$2"
}

. $script
