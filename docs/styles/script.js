document.addEventListener('DOMContentLoaded', function() {
  // bonjour au dev
  console.log('Bonjour a toi qui t\'aventures dans la console de dev !\nMoi c\'est kada, j\'ai dev ce petit site pour mon pote Tyfax\nAllez a + si tu veux discuter w me viens sur discord !');
  console.log(YT_API_KEY)
  console.log('les messages d\'erreur dans la console ne sont pas du a moi mais a ytb / logo discord ( je suis pas dev de l\'api discord !');
});

// === Widget Discord ===
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


// === FAQ ===
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
const YT_API_KEY = '${{secrets.YT_API_KEY}} '; 
const TYFAX_CHANNEL_ID = 'UCFzedEi7WdYCL8X5yh5zlwQ'; 

async function fetchLatestTyfaxVideo() {
    const cacheKey = 'latestTyfaxVideo';
    const cacheTTL = 60 * 60 * 1000; // 1 heure en ms

    // Vérifie le cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTTL) {
            renderVideo(data);
            return;
        }
    }

    const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${TYFAX_CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Erreur API YouTube:', errorData);
            throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        renderVideo(data);
    } catch (e) {
        console.error('Erreur lors du chargement de la vidéo:', e);
        document.getElementById('video-container').innerHTML = `<p>Erreur lors du chargement de la vidéo. <br> Surement limite d'api revient demain ou va direct sur sa chaine <a href="https://www.youtube.com/@tyfaxofficiel" target="_blank" rel="noopener">ici</a> !</p>`;
    }
}


// Fonction pour afficher la vidéo
function renderVideo(data) {
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
        document.getElementById('video-container').innerHTML = `<p>Impossible de charger la dernière vidéo</p>`;
    }
}

// === Appel pour charger la vidéo au démarrage ===
fetchLatestTyfaxVideo();






