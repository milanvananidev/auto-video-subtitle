# 🎥 Hindi Whisper Subtitle Generator with FFmpeg Overlay

This Node.js tool helps you generate **subtitles** from a Hindi video using **OpenAI Whisper**, and optionally **translates** them to English. It also overlays subtitles on a **black bar** at the bottom of the video using **FFmpeg**.

---

## 📦 Features

- ✅ Extracts audio from video (TODO)
- ✅ Transcribes Hindi speech using Whisper
- ✅ (TODO) Translates subtitles from Hindi to English
- ✅ Creates `.srt` subtitle files
- ✅ Adds black bar and overlays subtitles using FFmpeg

---

## 🚀 How to Use

### 1. Install dependencies

```bash
npm install
```

Make sure you also have:

- Python installed  
- OpenAI Whisper installed:  
  ```bash
  pip install git+https://github.com/openai/whisper.git
  ```
- FFmpeg installed and added to your system path

---

### 2. Prepare your input

Put your video file (e.g. `input.mp4`) in the same directory.

### 3. Run the script

```bash
node index.js
```

It will:
- Read `audio.json`
- Generate `output_subtitles.srt`
- Create a new video with a black bar and subtitles → `final_with_subtitles.mp4`

---

## 📁 Output Files

- `audio.wav` – extracted audio (if enabled)
- `audio.json` – Whisper’s transcription output
- `output_subtitles.srt` – Subtitle file
- `final_with_subtitles.mp4` – Final video with subtitles

---

## ✨ Bonus

To **translate subtitles**, uncomment the translation code and install:

```bash
npm install @vitalets/google-translate-api
```

Use this flag to reverse direction (English to Hindi):

```bash
node index.js input.mp4 --reverse
```

---

## 🧠 Credits

- [OpenAI Whisper](https://github.com/openai/whisper)  
- [FFmpeg](https://ffmpeg.org/)  
- [Vitalets Google Translate API](https://github.com/vitalets/google-translate-api)

---

## 💬 Feedback

Made with ❤️ by Milan Vanani
