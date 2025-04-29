document.addEventListener('DOMContentLoaded', function() {
    const rocketBtn = document.getElementById('rocket-btn');
    if (rocketBtn) {
        rocketBtn.addEventListener('click', function() {
            rocketBtn.classList.add('fire-on');
            setTimeout(() => {
                window.open('https://discord.gg/cckusrWTZT', '_blank');
                rocketBtn.classList.remove('fire-on');
            }, 600); // durée de l'animation feu
        });
    }
});

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

document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function() {
      // Fermer toutes les autres réponses
      document.querySelectorAll('.faq-answer').forEach(ans => {
          if (ans !== this.nextElementSibling) {
              ans.style.display = 'none';
          }
      });
      document.querySelectorAll('.faq-question').forEach(otherBtn => {
          if (otherBtn !== this) {
              otherBtn.classList.remove('active');
          }
      });
      // Ouvrir/fermer la réponse sélectionnée
      this.classList.toggle('active');
      const answer = this.nextElementSibling;
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
  });
});

// === Dernière vidéo YouTube Tyfax ===
const YT_API_KEY = 'AIzaSyA3NTWZGU97DfrNS0hJmiAm8H_Ie7kuPSs'; 
const TYFAX_CHANNEL_ID = 'UCFzedEi7WdYCL8X5yh5zlwQ'; 

async function fetchLatestTyfaxVideo() {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${TYFAX_CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Erreur API YouTube:', errorData);
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
      
        const video = (data.items || []).find(item =>
            item.id.kind === 'youtube#video' &&
           
            !/shorts?/i.test(item.snippet.title) &&
            !/live/i.test(item.snippet.title)
        );
        if (video && video.id.videoId) {
            document.getElementById('video-container').innerHTML = `
                <div class="video-yt-responsive" style="width:100%;">
                  <iframe width="100%" height="225" src="https://www.youtube.com/embed/${video.id.videoId}" title="${video.snippet.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius:8px;display:block;"></iframe>
                </div>
                <div style="width:100%;">
                  <p style="margin-top:0.5em;font-weight:bold;text-align:center;">${video.snippet.title}</p>
                </div>
            `;
        } else {
            document.getElementById('video-container').innerHTML = `<p>Impossible de charger la dernière vidéo (hors shorts/live).</p>`;
        }
    } catch (e) {
        console.error('Erreur lors du chargement de la vidéo:', e);
        document.getElementById('video-container').innerHTML = `<p>Erreur lors du chargement de la vidéo. Vérifiez la console pour plus de détails.</p>`;
    }
}

// === Appel pour charger la vidéo au démarrage ===
fetchLatestTyfaxVideo();



