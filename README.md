# Node_ffmpeg

This is the readme file for the Fall '22 - Spring '23 team's work here.

This Node.js server was created as a testing ground for back-end design ideas.

This code relies on Express and FFMPEG-CLI.



The code establishes a basic Node.js server, which you can run by navigating to the folder containing app.js via commandline and type "node app.js".

The server runs at the address "localh:3000/" (you need the "/" at the end to route the code right).

Right now, all this does is allow one line of FFMPEG code to run. The different methods of using FFMPEG are controlled by the "command_selection" variable. Read the comments to see how that works.

The files it uses are located in the same folder as "app.js" and are identified in code by the variable named "source" and "source2".

The output is hardcoded to just be named "output" for now.

To find the syntax of the commands, please refer to the following site: https://plutiedev.com/ffmpeg