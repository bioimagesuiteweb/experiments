# Base
FROM ubuntu:18.04

MAINTAINER Xenios Papademetris <xpapademetris@gmail.com>

# install system-wide deps for python and node
RUN apt-get -yqq update
RUN apt-get install -yqq python-pip python-dev python3 python3-pip
RUN apt-get install -yqq unzip g++ gcc cmake cmake-curses-gui
RUN apt-get install -yqq curl openjdk-8-jdk git make 
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -yq nodejs

# python packages
RUN pip3 install --upgrade pip

# dotbashrc and entrypoint file
COPY bash.bashrc /etc/bash.bashrc
RUN dos2unix /etc/bash.bashrc







