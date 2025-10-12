const contestsData = {
    1: {
        title: "Фотоконкурс 'Лучший пейзаж'",
        participants: [
            { id: 1, name: "Анна Петрова", description: "Закат в горах", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 15 },
            { id: 2, name: "Иван Сидоров", description: "Осенний лес", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 22 },
            { id: 3, name: "Мария Козлова", description: "Морской пейзаж", image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 18 },
            { id: 4, name: "Дмитрий Волков", description: "Городской пейзаж", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 10 }
        ]
    },
    2: {
        title: "Конкурс рисунков 'Мир глазами детей'",
        participants: [
            { id: 1, name: "Света Иванова (8 лет)", description: "Моя семья", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 28 },
            { id: 2, name: "Коля Смирнов (7 лет)", description: "Космос", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 35 },
            { id: 3, name: "Лена Попова (9 лет)", description: "Летний день", image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 20 },
            { id: 4, name: "Артем Кузнецов (6 лет)", description: "Динозавры", image: "https://images.unsplash.com/photo-1578321272177-16c281f0ad47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 15 }
        ]
    },
    3: {
        title: "Кулинарный конкурс 'Лучший десерт'",
        participants: [
            { id: 1, name: "Ольга Новикова", description: "Шоколадный торт", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 12 },
            { id: 2, name: "Сергей Морозов", description: "Тирамису", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 18 },
            { id: 3, name: "Екатерина Белова", description: "Чизкейк", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 25 },
            { id: 4, name: "Алексей Григорьев", description: "Пирожные макарон", image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", votes: 8 }
        ]
    }
};

let userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};

document.addEventListener('DOMContentLoaded', function() {
    updateResults();
    
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contestId = this.getAttribute('data-contest');
            openVotingModal(contestId);
        });
    });
    
    const modal = document.getElementById('voteModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function openVotingModal(contestId) {
    const modal = document.getElementById('voteModal');
    const modalTitle = document.getElementById('modalTitle');
    const participantsList = document.querySelector('.participants-list');
    
    modalTitle.textContent = contestsData[contestId].title;
    
    participantsList.innerHTML = '';
    
    const hasVoted = userVotes[contestId];
    
    contestsData[contestId].participants.forEach(participant => {
        const participantItem = document.createElement('div');
        participantItem.className = 'participant-item';
        
        const isVotedFor = hasVoted === participant.id;
        
        participantItem.innerHTML = `
            <div class="participant-image">
                <img src="${participant.image}" alt="${participant.name}">
            </div>
            <div class="participant-info">
                <div class="participant-name">${participant.name}</div>
                <div class="participant-description">${participant.description}</div>
                <div class="vote-count">Голосов: ${participant.votes}</div>
            </div>
            <button class="btn ${isVotedFor ? 'voted' : ''}" 
                    onclick="voteForParticipant(${contestId}, ${participant.id})" 
                    ${hasVoted ? 'disabled' : ''}>
                ${isVotedFor ? 'Ваш голос' : 'Голосовать'}
            </button>
        `;
        
        participantsList.appendChild(participantItem);
    });
    
    modal.style.display = 'block';
}

function voteForParticipant(contestId, participantId) {
    if (userVotes[contestId]) {
        alert('Вы уже проголосовали в этом конкурсе!');
        return;
    }
    
    const participant = contestsData[contestId].participants.find(p => p.id === participantId);
    participant.votes++;
    
    userVotes[contestId] = participantId;
    localStorage.setItem('userVotes', JSON.stringify(userVotes));
    
    updateResults();
    
    document.getElementById('voteModal').style.display = 'none';
    
    alert('Спасибо за ваш голос!');
}

function updateResults() {
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';
    
    Object.keys(contestsData).forEach(contestId => {
        const contest = contestsData[contestId];
        const contestResults = document.createElement('div');
        contestResults.className = 'contest-results';
        
        const contestTitle = document.createElement('h4');
        contestTitle.textContent = contest.title;
        contestResults.appendChild(contestTitle);
        
        const sortedParticipants = [...contest.participants].sort((a, b) => b.votes - a.votes);
        
        const maxVotes = Math.max(...sortedParticipants.map(p => p.votes));
        
        sortedParticipants.forEach(participant => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const percentage = maxVotes > 0 ? (participant.votes / maxVotes) * 100 : 0;
            
            resultItem.innerHTML = `
                <div class="result-name">${participant.name}</div>
                <div class="result-bar">
                    <div class="result-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="result-count">${participant.votes}</div>
            `;
            
            contestResults.appendChild(resultItem);
        });
        
        resultsContainer.appendChild(contestResults);
    });
}