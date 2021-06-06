<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :href="name"></use>
      <linearGradient id="gradient-horizontal">
        <stop offset="0%" stop-color="var(--color-stop-1)" />
        <stop offset="50%" stop-color="var(--color-stop-2)" />
        <stop offset="100%" stop-color="var(--color-stop-3)" />
      </linearGradient>
      <linearGradient id="gradient-vertical" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-stop-1)" />
        <stop offset="50%" stop-color="var(--color-stop-2)" />
        <stop offset="100%" stop-color="var(--color-stop-3)" />
      </linearGradient>
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconName: {
      // icon filename
      // type: String,
      required: true,
    },
    className: {
      // css class name
      type: String,
      required: false
    },
    outline:{
      type:Boolean,
      require:false
    }

},
computed: {
name() {
  let icon = this.iconName
  return require(`@/assets/svg_icons/${icon}.svg`).default
  // return icon ? `#icon-${icon}` : ''

},
svgClass() {
  let className = this.className
  let outlined = this.outline
  if(outlined){
    className += ' outlined '
  }
  return className ? `svg-icon ${className}` : 'svg-icon '
},

},
}
</script>

<style lang="scss">
.outlined{
  fill:none;
  stroke-width: 1;
}
.svg-icon {
    // fill: currentColor;
    //stroke: $svg-icon-stroke-color;
    //stroke: currentColor;
    //stroke-width: $svg-icon-stroke-width;
    overflow: hidden;
  &.stroke-animate {
      stroke-dasharray:60;
      stroke-dashoffset: 0;
      animation: dash 1s ease-in-out;
  }

}
@keyframes dash {
  from{
    stroke-dashoffset: 60;
  }
  to {
    stroke-dashoffset: 0;
  }
}

#gradient-horizontal {
  --color-stop-1: #a770ef;
  --color-stop-2: #cf8bf3;
  --color-stop-3: #fdb99b;
}
#gradient-vertical {
  --color-stop-1: #00c3ff;
  --color-stop-2: #77e190;
  --color-stop-3: #ffff1c;
}
.icon-hgradient {
    fill: url(#gradient-horizontal) #F59E0B;
}
.icon-vgradient {
    fill: url(#gradient-vertical) #1D4ED8;
}
</style>