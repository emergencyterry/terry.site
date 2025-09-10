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

  // Move the built files from dist/public to dist root for GitHub Pages
  console.log('📁 Reorganizing files for GitHub Pages...');
  execSync('cp -r dist/public/* dist/', { stdio: 'inherit' });
  execSync('rm -rf dist/public', { stdio: 'inherit' });

  // Copy the 404.html for GitHub Pages routing
  console.log('🔄 Copying 404.html for GitHub Pages routing...');
  copyFileSync('404.html', 'dist/404.html');

  // Fix absolute paths in index.html for GitHub Pages
  console.log('🔧 Fixing asset paths for GitHub Pages...');
  const { readFileSync, writeFileSync } = await import('fs');
  let indexContent = readFileSync('dist/index.html', 'utf-8');
  
  // Convert absolute paths to relative paths
  indexContent = indexContent.replace(/src="\/assets\//g, 'src="./assets/');
  indexContent = indexContent.replace(/href="\/assets\//g, 'href="./assets/');
  
  writeFileSync('dist/index.html', indexContent);

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