<template>
  <div>
    Hello
  </div>
</template>

<script>

export default {
  mounted: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const  d = urlParams.get('myParam');
  }
}
</script>
