# OceanOS

OceanOS is a personal Operating System.

You can see it as a mix of productivity app, note taking, expense tracker and much more...

It is a great tool for habit formation, tracking objectives, and stay organized.

It uses the concept of [lifestreaming](https://en.wikipedia.org/wiki/Lifestreaming) to organize your life events.

To build it, you need @angular/cli and @nestjs/cli installed globally.

    npm install -g @angular/cli @nestjs/cli

Then build the docker image just run the script

    ./build-docker-image.sh

And to run it, you just have to expose the port 3000 and choose a directory for the db

    docker run -p 3000:3000 -v <your db directory>:/oos/db oos

That's it !