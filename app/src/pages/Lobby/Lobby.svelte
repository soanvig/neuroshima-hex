<script lang="ts">
  import Button from '../../components/ui/Button.svelte';
  import Window from '../../components/ui/Window.svelte';
  import { useNavigate } from 'svelte-navigator';

  const navigate = useNavigate();
  let isCreating = false;

  const createMatch = async () => {
    isCreating = true;
    const response = await fetch('http://localhost:5001/neuroshima-hex-311119/us-central1/api/createRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    isCreating = false;

    navigate(`/game/${ data.room }`);
  };
</script>
<Window header="Lobby">
  <div class="controls">
    <Button disabled='{isCreating}' on:click={createMatch}>Create match</Button>
  </div>
</Window>
<style>
</style>
