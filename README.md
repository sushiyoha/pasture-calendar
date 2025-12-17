# 点击该网址访问
https://red-rock-0feb78b00.2.azurestaticapps.net/
# 说明
目前没有存储功能，所以一旦退出浏览器，所有事项会清空。<br>我用Gemini写的代码，然后下载了部署到github和azure上。<br>提示词：“Create a 3D interactive calendar web application with a 'Healing' and aesthetic visual style.
1. Dynamic Grid System (View Modes):
The user must define the view by selecting two units: a Major Unit (Container) and a Minor Unit (Grid Item). Options include: Year, Half-Year, Quarter, Month, Week, Day.
Logic: The system should calculate the number of grids based on these units.
Example A: Major = Year, Minor = Day -> Render 365 (or 366) grids.
Example B: Major = Year, Minor = Month -> Render 12 grids.
2. Visual Metaphor (The Grass & Sheep):
Appearance: Each grid represents a patch of grass (3D terrain).
Task Interaction:
Add Task: When a user adds a to-do item to a specific time grid, spawn a 3D Sheep that wanders randomly within that specific grid's boundaries.
Remove/Complete Task: Removing or completing a task removes one sheep from that grid.
Dynamic Environment: Implement a visual state for the grass quality. As the number of sheep (tasks) in a grid increases, the grass in that grid should look more 'barren' or overgrazed (less green, more brown/dirt visible).
3. Core Features:
Users can click a grid to add, view, complete, or delete tasks.
Tech Stack suggestion: React, Three.js (or React Three Fiber).
Style: High-quality 3D rendering, cozy, relaxing, and minimalist UI.”


<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1r7cJ7QV68INuvaIioUJ097HhhXtf_fQQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
