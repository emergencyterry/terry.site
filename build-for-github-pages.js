#!/usr/bin/env node

/**
 * Build script for GitHub Pages deployment
 * This script creates a static build that works with GitHub Pages
 */

import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

console.log('🚀 Building terry.site for GitHub Pages...');

try {
  // Clean and build the React app
  console.log('📦 Building React application...');
  execSync('vite build', { stdio: 'inherit' });

  // Don't copy the static index.html - let Vite's built index.html remain
  console.log('📄 Using Vite-built index.html (preserving React app entry point)...');

  // Copy the 404.html for GitHub Pages routing
  console.log('🔄 Copying 404.html for GitHub Pages routing...');
  copyFileSync('404.html', 'dist/404.html');

  console.log('✅ Build complete!');
  console.log('');
  console.log('📋 Deployment Instructions:');
  console.log('1. Commit all changes to your repository');
  console.log('2. Push to the main branch');
  console.log('3. Go to your GitHub repository Settings > Pages');
  console.log('4. Set Source to "Deploy from a branch"');
  console.log('5. Set Branch to "main" and folder to "/dist"');
  console.log('6. Save and wait for deployment');
  console.log('');
  console.log('🌟 Your site will be available at: https://[username].github.io/[repository-name]');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}