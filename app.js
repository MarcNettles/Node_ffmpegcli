/*
* Marc Nettles CSCI 4308 Senior Capstone Team Digiclips
*
* Here I have set up a basic node.js server to test different methods of calling ffmpeg to cut a video.
* So far, this yields the best results. I tried using just the ffmpeg node package, but wasn't having much luck. It just wasn't doing anything.
* Then I tried fluent-ffmpeg, and I was still having issues.
* Now, I'm using ffmpeg-cli (go to root directory of your node.js server, open a terminal so you're at the root directory of that server, and type npm install ffmpeg-cli)
* 
* You'll also need to do "npm install express"
* In this basic example, I have a file called "sample.mp4" sitting in the root directory and will be outputting a clipped 10s version "output.mp4"
* located in the root directory as well.
*/



// Note: Last revised 11/28/2022: Settled on ffmpeg-cli. Trying it out in different ways to test efficiency. Tried cutting mp4 to mp4
// by not re-encoding the video or audio, which is working out great.

// Note: Cutting mp4 to avi works, but it requires re-encoding. Processing speeds not too bad, about 2 mins for a 15 min clip.

// Note: Cutting and changing resolution to 640x480 (from source resolution 1920x1080) does alright, but I think it's a bit
// Note: slow because it's changing the entire video to 640x480 instead of just the clip.
// Note: Solution: Clip the video first, then run another ffmpeg command to alter resolution


//---------------------------------------------------- Basic Set-Up -------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------//
// Note: The sponsor uses express, so we will too.
const express = require("express");
const app = express();
const port = 3000;
//-------------------------------------------------------------------------------------------------------------------------------------//


//--------------------------------------------- Using ffmpeg-cli node package ---------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------//
// Note: Here we require ffmpeg-cli, which we'll use ffmpeg.runSync(). We can also run aync by using ffmpeg.run(), which returns a Promise.
// Note: Learn more here: https://www.npmjs.com/package/ffmpeg-cli
const ffmpeg = require("ffmpeg-cli");
ffmpeg.run("-version");
console.log(ffmpeg.runSync("-version"));
//-------------------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------- Not working? ------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------//
/* Note: Was trying to change the path to FFMPEG, but I don't know if this is working. Deleting FFMPEG from the original path just forces
 * FFMPEG to be redownloaded into ffmpeg-cli
*/
//ffmpeg.path = "/home/marc/ffmpeg";
//console.log(ffmpeg.path)
//-------------------------------------------------------------------------------------------------------------------------------------//





//--------------------------------------- Setting Source for FFMPEG video -------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------//
// Note: Temporary hardcoded source. I'm using both sample.mp4, a 30s clip found in the same directory as app.js, for most of the cutting.
const source = "sample.mp4"
const source2 = "sample2.mp4" // Used for testing the splicing feature
//-------------------------------------------------------------------------------------------------------------------------------------//


//----------------------------------------------- Setting View Engine to PUG ----------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------//
// Note: The sponsor uses pug, so we will too.
app.set('view engine', 'pug');
//-------------------------------------------------------------------------------------------------------------------------------------//






//------------------------------------------------- Routing GET requests --------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------//
// Note: Route when we go to "http://localhost:" + port + "/"
app.get('/', (req,res) =>{ // (req,res) is likely where we'll be getting our start and end times from.
    /*
    * Big note: We MAY need to add "-pix_fmt yuv420p" flag in order to not have
    * ffmpeg use YUV 4:4:4 as noted in the Converting a video to MP4 section of
    *  https://plutiedev.com/ffmpeg
    */




    //-------- Select What You'd Like to Do ----------//
    // 1. Cut MP4 and output MP4  (cut video)
    // 2. Cut MP4 and output AVI  (change filetype)
    // 3. Cut MP4 and output MP4, but change the resolution to 640x480 (change resolution)
    // 4. Splice Videos Together (combine videos)
    command_selection = 1



    if(command_selection == 1)
    {
      //--------------------------------- Cutting MP4-MP4 ------------------------------------------------//
      //-------------------------------------------------------------------------------------------------//
      /*
      * Note: If we're keeping the same filetype (mp4->mp4), we can skip re-encoding, speeding
      * up processing so it only takes about 5 seconds, regardless of clip length.
      * 
      * NOTE: Skipping re-encoding video causes black screen at start of video. Removed "-c:v copy" from the flags
      */
      
      // Note: Commands to feed into ffmpeg.runSync(commands). It's exactly what you'd type into the command line interface (hence the -cli part of ffmpeg-cli).
      // Note: -c:v copy -c:a copy speeds up our time to cut the video because it reuses the video and audio from the old clip so we don't have to reencode it.
      // Note: "-loglevel debug -v verbose -report" is for logging. -report outputs the command line output and a log into a log file
      // in the local directory.
      // Note:  Commented Out Temporarily: -loglevel debug -v verbose -report 

      // Note: Cutting video syntax: "-i <inputfile> -ss <start of cut in HH:MM:SS or HH:MM:SS.SS format> -t <length of cut in HH:MM:SS or HH:MM:SS.SS format> [additional flags like -c:v copy] <outputfile> > <crash logs>"
      commands = "-loglevel debug -v verbose -report -i " + source + " -ss 00:00:00 -t 00:00:20 -c:a copy samplecut.mp4 > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt";
      // REMOVED -c:v copy because it was causing the screen to be black for the first few seconds.
      //--------------------------------------------------------------------------------------------------//
    }



    if(command_selection == 2)
    {
      //------------------------------------ Cutting MP4-AVI ---------------------------------------------------//
      //--------------------------------------------------------------------------------------------------------//
      /*
      * Note: Converting to a different filetype means we can't skip re-encoding.
      * Re-encoding a 15 min clip of a 50 min video, going from mp4 to avi, took me
      * roughly 2 minutes. Each additional 15 minutes took an additional 2 minutes,
      * so for example a 45 min cut took a little under 6 minutes to finish.
      */
      // Note: For converting to a different filetype, such as avi, we can't skip re-encoding
      
      // <UNCOMMENT ME> commands = "-loglevel debug -v verbose -report -i " + source + " -ss 00:00:10 -t 00:00:20 output.avi > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt";
      
      //--------------------------------------------------------------------------------------------------------//
    }



    if(command_selection == 3)
    {
      //----------------------------------- Cutting MP4-MP4 and changing Resolution to 640x480 --------------------//
      //-----------------------------------------------------------------------------------------------------------//
      // Note: For converting to a different resolution, we'll test below to see
      // how long it takes with and without re-encoding.

      // Note: Solution: Don't run one 

      // Note: Without re-encoding (mp4->mp4)
      // <UNCOMMENT ME> commands = "-loglevel debug -v verbose -report -i " + source + " -ss 00:00:10 -t 00:00:20 -c:a copy -s 640x480 output.mp4 > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt"; // Had to use sample.mp4 again because it seems like it converts the ENTIRE video to 640x480, which takes forever.

      // Note With re-encoding (mp4->avi)
      // <UNCOMMENT ME> commands = "-loglevel debug -v verbose -report -i " + source + " -ss 00:00:10 -t 00:00:20 -s 640x480 DToutput.avi > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt";
      
      //--------------------------------------------------------------------------------------------------------//
    }


    if(command_selection == 4)
    {
      //---------------------------(not working) Splice Videos Together (not working)---------------------------//
      //--------------------------------------------------------------------------------------------------------//

      // Note: Just splicing
      /* Note: Tried different ways, first one comes directly from https://plutiedev.com/ffmpeg, but neither work as of right now */

      // Note: The problem here is it gives this error: Stream specifier ':v' in filtergraph description [0:v][1:v]concat=n=2:v=1:a=1[out] matches no streams.
      // <UNCOMMENT ME> commands = '-report -i ' + source + ' -i ' + source2 + ' -filter_complex "[0:v][1:v]concat=n=2:v=1:a=1[out]" -map "[out]" outputSplice.mp4 > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt'
      
      // <UNCOMMENT ME> commands = '-report -i ' + source + ' -i ' + source2 + ' -filter_complex "[0:v][v0]; [1:v][v1]; [0:v][1:v]concat=n=2:v=1:a=1[out]" -map "[out]" outputSplice.mp4 > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt'
      
      // <UNCOMMENT ME> commands = '-report -f concat -i ' + source + ' -i ' + source2 + ' -c copy output.mp4 > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt'
      
      // Note: This..... doesn't work. It just produces a video that's 30 seconds (the exact length of one of the videos)
      // <UNCOMMENT ME> commands = '-report -i "concat:'+source+'|'+source2+'" -c copy outputSplice.mp4'

      /* Note: For trimming AND splicing at the same time: 
      * ffmpeg -i video1.avi -i video2.avi -i video3.avi
        -filter_complex "[0:v]trim=0:5[v0];
                          [1:v]trim=60:65[v1];
                          [2:v]trim=0:120[v2];
                          [v0][v1][v2]concat=n=3:v=1:a=1[out]"
        -map "[out]" output.mp4
      * https://ffmpeg.org/ffmpeg-filters.html#trim
      */
      // <UNCOMMENT ME> commands = '-report -i ' + source + ' -i ' + source2 + ' -filter_complex "[0:v]trim=5:10[v0]; [1:v]trim=15:20[v1]; [v0][v1]concat=n=2:v=1:a=1[out]" -map "[out]" outputTrimSplice.mp4 > /home/marc/Node_ffmpegcli/ffmpeg_crash_logs/crash_log.txt'
      

      //--------------------------------------------------------------------------------------------------------//
    }




    //-------------------------------------- Run FFMPEG ------------------------------------------------------//
    //--------------------------------------------------------------------------------------------------------//
    //--------------------------------
    // Note: Finally, we run the commands.
    //-------------------------------

    // Note: This would run asynchronously, but I'm having trouble getting it to output. 
    // <UNCOMMENT ME>  ffmpeg.run(commands)

    // Note: Currently only have this working with synchronous execution
    ffmpeg.runSync(commands);
    //--------------------------------------------------------------------------------------------------------//
});
//-------------------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------Listen for HTML requests------------------------------------//
//--------------------------------------------------------------------------------------------------------//
// Note: Run the server on port port.
app.listen(port);
//--------------------------------------------------------------------------------------------------------//