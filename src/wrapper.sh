#!/bin/bash

script="$1"
fd3="/dev/fd/3"

[ ! -e $fd3 ] && echo "DON'T RUN THIS DIRECTLY" && exit 2
[ -z "$script" ] && echo "DON'T RUN THIS DIRECTLY" && exit 2

. $WRAPPER_SOURCE/JSON.sh

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
  echo "$response" | tokenize | parse | grep 'id' | tr "\t" "\n"
}

. $script
