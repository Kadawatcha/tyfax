fetch('https://discord.com/api/guilds/1218489450699423806/widget.json')
.then(response => response.json())
.then(data => {
  // Affiche le nombre de membres
  const membersSpan = document.getElementById('discord-members');
  if (membersSpan) {
    membersSpan.textContent = ` ${data.presence_count} membres`;
  }

  // Affiche le nom du serveur dans l'aside (par exemple dans un span avec id="discord-server-name")
  const serverNameSpan = document.getElementById('discord-server-name');
  if (serverNameSpan) {
    serverNameSpan.textContent = data.name;
  }
})
.catch(error => {
  console.error('Erreur lors du chargement du widget Discord :', error);
});