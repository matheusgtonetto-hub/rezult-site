(() => {
  let lastHash = '';

  const checkForUpdates = async () => {
    try {
      const response = await fetch(`/styles.css?t=${Date.now()}`);
      const text = await response.text();
      const hash = text.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0).toString();

      if (lastHash && lastHash !== hash) {
        console.log('[Live Reload] Mudanças detectadas, recarregando...');
        window.location.reload();
      }

      lastHash = hash;
    } catch (error) {
      console.error('[Live Reload] Erro ao verificar atualizações:', error);
    }
  };

  checkForUpdates();
  setInterval(checkForUpdates, 1000);
})();
