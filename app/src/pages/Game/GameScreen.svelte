<script lang="ts">
  import Board from './Board.svelte';
  import { useParams } from 'svelte-navigator';

  const params = useParams();
</script>
<div class="container">
  <Board room={$params.roomId}/>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

</style>
