const fs = require("fs");
const { execSync } = require("child_process");

const inputFile = process.argv[2] || "input.mp4";

function log(step) {
    console.log(`\n🔹 [${new Date().toLocaleTimeString()}] ${step}`);
}

function runCommand(command, desc) {
    log(`Running: ${desc}`);
    try {
        const output = execSync(command, { stdio: "pipe" });
        console.log(output.toString());
    } catch (err) {
        console.error(`❌ Error during "${desc}":\n`, err.stderr?.toString() || err.message);
        process.exit(1);
    }
}

function formatTime(sec) {
    const date = new Date(0);
    date.setSeconds(sec);
    return date.toISOString().substr(11, 8) + "," + String(sec % 1).substring(2, 5).padEnd(3, "0");
}

async function main() {
    // Check if the Whisper output exists (this would be generated already from a prior process)
    log(`🎧 Extracting audio from ${inputFile}`);
    runCommand(`ffmpeg -y -i ${inputFile} -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav`, "Extract audio with ffmpeg");

    log("🧠 Running Whisper transcription...");
    runCommand('whisper audio.wav --language hi --task transcribe --output_format json', "Whisper transcription");

    // Check if the audio.json file exists after transcription
    if (!fs.existsSync("audio.json")) {
        console.error("❌ audio.json not found — Whisper may have failed.");
        return;
    }

    log("📖 Reading Whisper output...");
    const whisperOutput = JSON.parse(fs.readFileSync("audio.json", "utf-8"));
    const segments = whisperOutput.segments;

    log(`🌐 Creating subtitles...`);
    let srtContent = "";

    const totalSegments = segments.length;
    let completedSegments = 0;

    const logProgress = setInterval(() => {
        const percentage = ((completedSegments / totalSegments) * 100).toFixed(2);
        process.stdout.write(`🔄 Progress: ${percentage}%\r`);
    }, 1000);

    for (let i = 0; i < totalSegments; i++) {
        const seg = segments[i];
        try {
            process.stdout.write(`🔁 Creating subtitle for segment ${i + 1}/${totalSegments}\r`);
            srtContent += `${i + 1}\n`;
            srtContent += `${formatTime(seg.start)} --> ${formatTime(seg.end)}\n`;
            srtContent += `${seg.text}\n\n`;

            // Increment completed segments after processing
            completedSegments++;

        } catch (err) {
            console.error(`❌ Error creating subtitle for segment ${i}:`, err);
        }
    }

    // Stop the progress log once all segments are processed
    clearInterval(logProgress);

    // Write the subtitles to a file
    log("💾 Writing subtitles...");
    fs.writeFileSync("output_subtitles.srt", srtContent);
    log("✅ Subtitles saved as output_subtitles.srt");

    // Logic to add a black bar and overlay subtitles on the video
    log("🎬 Adding black bar and burning subtitles...");
    const outputFile = "final_with_subtitles.mp4";
    const command = `ffmpeg -i ${inputFile} -vf "drawbox=y=ih-80:h=80:c=black:t=fill,subtitles=output_subtitles.srt" -c:a copy ${outputFile}`;
    runCommand(command, "Adding black bar and subtitles");

    log("🔥 Done! Video with subtitles saved as final_with_subtitles.mp4");
}

main();
