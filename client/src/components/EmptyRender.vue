 <!-- Panel content with some animations, displayed when the markdown source is empty -->
<template>
  <!-- Explicit duration because the transition is not on the root element -->
  <transition
    name="slide"
    :duration="300" 
    appear
  >
    <v-layout 
      id="layout-main"
      v-ripple="{ center: true, class: 'primary--text' }" 
      align-center
      fill-height
      column
      justify-center
    >
      <div align-center id="top-container">
        <div id="rotate" class="abs-center">
          <div id="circle-clip" class="abs-center">
            <div id="circle" class="abs-center"></div>
          </div>
        </div>
        <p id="main-text" class="display-2 abs-center">Empty render.</p>
      </div>
      <div id="bottom-text-wrapper">
        <p id="bottom-text-1" class="bottom-text title">This panel will update automatically</p>
        <p id="bottom-text-2" class="bottom-text title">Edit the markdown on the left panel</p>
      </div>
    </v-layout>
  </transition>
</template>

<style lang="scss" scoped>
$slide-duration: 0.3s;
$circle-duration: 0.2s;
$circle-grow-duration: 0.3s;
$circle-size: 400px;

.abs-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Slide to the right */

.slide-enter #top-container, .slide-leave-to #top-container{
  opacity: 0;
  left: 100%;
}

.slide-enter-to #top-container, .slide-leave #top-container{
  opacity: 1;
  left: 0%;
}

.slide-enter-active #top-container {
  transition: all $slide-duration ease-out;
}

.slide-leave-active #top-container {
  transition: all $slide-duration ease-in;
}

/* Slide to the bottom */

.slide-enter #bottom-text-wrapper, .slide-leave-to #bottom-text-wrapper{
  bottom: -50%;
}

.slide-enter-to #bottom-text-wrapper, .slide-leave #bottom-text-wrapper{
  bottom: 0px;
}

.slide-enter-active #bottom-text-wrapper {
  transition: all $slide-duration ease-out;
}

.slide-leave-active #bottom-text-wrapper {
  transition: all $slide-duration ease-in;
}

/* Circle */

.slide-enter #circle, slide-leave-to #circle {
  width: 0%;
  height: 0%;
  border-width: 0;
}

#circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid var(--v-primary-base);
  transition: width $circle-grow-duration ease-out $slide-duration, 
    height $circle-grow-duration ease-out $slide-duration,
    border-width $circle-grow-duration ease-out $slide-duration,
    border-color $circle-duration ease-in-out;
}

#circle-clip {
  width: $circle-size;
  height: $circle-size;
  clip-path: inset(33% 0 33% 0);
}

#rotate {
  transition: transform $circle-duration ease-in-out;
}

#layout-main:hover #rotate {
  transform: rotate(180deg);
}

#layout-main:hover #circle {
  border-color: var(--v-secondary-base);
}

#top-container {
  position: relative;
  width:100%;
}

#layout-main {
  position: relative;
}

/* Bottom text */

.bottom-text {
  transition: opacity $circle-duration ease-in-out;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translate(-50%, 50%);
  margin: 0;
}

#bottom-text-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
}

#bottom-text-2 {
  opacity: 0;
}

#layout-main:hover #bottom-text-2 {
  opacity: 1;
}

#layout-main:hover #bottom-text-1 {
  opacity: 0;
}

#main-text {
  white-space: nowrap;
}
</style>

