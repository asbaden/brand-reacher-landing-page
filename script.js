// script.js
// Add any interactive or dynamic functionalities here if needed.
// For now, this file is a placeholder for future enhancements.

document.addEventListener('DOMContentLoaded', function() {
  // Navigation handler
  const links = document.querySelectorAll('.nav-links a, .btn:not(#warp)');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target section id
      const targetId = this.getAttribute('href');
      
      // Skip if it's just "#" or the warp button
      if (targetId === '#' || this.id === 'warp') return;
      
      // Find the target section
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;
      
      // Get the offset
      const navHeight = 60; // Fixed nav height
      
      // Scroll to section
      targetSection.scrollIntoView();
      // Adjust for nav bar
      window.scrollBy(0, -navHeight);
      
      // Close mobile menu if open
      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelector('.nav-links');
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  });

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Warp drive effect
  window.requestAnimFrame = (function(){   
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) { window.setTimeout(callback, 1000 / 60); };
  })();

  var canvas = document.getElementById("space");
  var c = canvas.getContext("2d");

  // Set canvas size immediately
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var numStars = 3000; // Reduced number of stars
  var radius = '0.'+Math.floor(Math.random() * 9) + 1;
  var focalLength = canvas.width * 2;
  window.warp = 0;
  var centerX, centerY;

  // Pre-calculate values and cache DOM lookups
  var TWO_PI = Math.PI * 2;
  var warpButton = document.getElementById('warp');
  
  // Use requestAnimationFrame more efficiently
  var animationId;
  var lastTime = 0;
  const FPS = 60;
  const frameDelay = 1000 / FPS;

  var stars = [], star;
  var i;

  var animate = true;

  initializeStars();

  function executeFrame(){
    animationId = requestAnimFrame(executeFrame);
    
    const currentTime = Date.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed > frameDelay) {
      lastTime = currentTime - (elapsed % frameDelay);
      moveStars();
      drawStars();
    }
  }

  function initializeStars(){
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    
    stars = [];
    for(i = 0; i < numStars; i++){
      star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        o: (Math.random() * 0.6 + 0.4).toFixed(2) // Brighter stars
      };
      stars.push(star);
    }
  }

  function moveStars(){
    for(i = 0; i < numStars; i++){
      star = stars[i];
      star.z -= (window.warp ? 25 : 1); // Increased warp speed
      
      if(star.z <= 0){
        star.z = canvas.width;
      }
    }
  }

  function drawStars(){
    var pixelX, pixelY, pixelRadius;
    
    // Resize to the screen
    if(canvas.width !== window.innerWidth || canvas.height !== window.innerHeight){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
    }
    
    // Clear canvas more efficiently
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    if(window.warp==0) {
      c.fillStyle = "rgba(0,0,0,1)";
      c.fillRect(0,0, canvas.width, canvas.height);
    }
    if(window.warp==1) {
      c.fillStyle = "rgba(0,0,0,0.1)";
      c.fillRect(0,0, canvas.width, canvas.height);
    }
    
    // Batch similar operations
    c.save();
    c.shadowBlur = window.warp ? 25 : 15;
    c.shadowColor = "rgba(255,255,255,0.8)";
    c.fillStyle = "rgba(255, 255, 255, "+radius+")";

    for(i = 0; i < numStars; i++){
      star = stars[i];
      
      // Optimize calculations
      const scale = focalLength / star.z;
      pixelX = (star.x - centerX) * scale;
      pixelX += centerX;
      pixelY = (star.y - centerY) * scale;
      pixelY += centerY;
      pixelRadius = (window.warp ? 0.8 : 0.4) * scale;
      
      // Draw circular stars with glow
      c.beginPath();
      c.arc(pixelX, pixelY, pixelRadius, 0, TWO_PI);
      c.fill();
      
      c.fillStyle = "rgba(255, 255, 255, "+star.o+")";
    }
    c.restore();
  }

  warpButton.addEventListener("mouseenter", function(e){
    e.preventDefault();
    window.warp = 1;
    executeFrame();
  });

  warpButton.addEventListener("mouseleave", function(e){
    e.preventDefault();
    window.warp = 0;
    executeFrame();
  });

  // Add cleanup on page visibility change
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      executeFrame();
    }
  });

  executeFrame();
});