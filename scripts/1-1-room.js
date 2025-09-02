// 전역 변수
let currentUser = null;
let roomId = null;
let isConnected = false;
let messageCounter = 0;

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('1:1 대화방이 로드되었습니다.');
    
    // URL에서 방 ID와 매칭 정보 가져오기
    initializeRoom();
    
    // 요소들 가져오기
    const leaveRoomBtn = document.getElementById('leaveRoomBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('messageInput');
    const goHomeBtn = document.getElementById('goHomeBtn');
    
    // 나가기 버튼 클릭 이벤트
    leaveRoomBtn.addEventListener('click', function() {
        console.log('방 나가기 요청됨');
        leaveRoom();
    });
    
    // 보내기 버튼 클릭 이벤트
    sendMessageBtn.addEventListener('click', function() {
        console.log('메시지 전송 요청됨');
        sendMessage();
    });
    
    // Enter 키로 메시지 전송
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 입력 필드 자동 높이 조절
    messageInput.addEventListener('input', function() {
        autoResizeTextarea(this);
    });
    
    // 홈으로 돌아가기 버튼
    goHomeBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 페이지 로드 완료 로그
    const loadTime = performance.now();
    console.log(`1:1 대화방 로드 완료: ${loadTime.toFixed(2)}ms`);
    
    // 실시간 연결 상태 모니터링 시작
    startConnectionMonitoring();
});

/**
 * 방 초기화
 */
function initializeRoom() {
    try {
        // URL 파라미터에서 방 ID 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        roomId = urlParams.get('roomId');
        
        if (!roomId) {
            console.error('방 ID가 없습니다.');
            showGameEndModal('방 ID를 찾을 수 없습니다.');
            return;
        }
        
        console.log('방 ID:', roomId);
        
        // 현재 사용자 정보 설정 (매칭 시스템에서 가져온 정보 사용)
        if (window.currentUser) {
            currentUser = window.currentUser;
        } else {
            // 임시 사용자 정보 생성
            currentUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: '사용자',
                joinTime: Date.now()
            };
        }
        
        console.log('현재 사용자:', currentUser);
        
        // 방 상태를 localStorage에 저장
        localStorage.setItem(`botornot_room_${roomId}_status`, 'active');
        
        // 기존 사용자 목록에 현재 사용자 추가 (덮어쓰기가 아닌 추가)
        const existingUsers = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_users`) || '[]');
        if (!existingUsers.includes(currentUser.id)) {
            existingUsers.push(currentUser.id);
            localStorage.setItem(`botornot_room_${roomId}_users`, JSON.stringify(existingUsers));
            console.log(`✅ 사용자 목록에 추가됨: ${currentUser.name} (총 ${existingUsers.length}명)`);
        } else {
            console.log(`ℹ️ 사용자가 이미 목록에 존재함: ${currentUser.name}`);
        }
        
        // 방 제목 업데이트
        updateRoomTitle();
        
        // 연결 상태 업데이트
        updateConnectionStatus('연결됨');
        isConnected = true;
        
        // 방 제목 업데이트 (사용자 수 반영)
        updateRoomTitle();
        
    } catch (error) {
        console.error('방 초기화 중 오류 발생:', error);
        showGameEndModal('방 초기화 중 오류가 발생했습니다.');
    }
}

/**
 * 방 제목 업데이트
 */
function updateRoomTitle() {
    const roomTitle = document.querySelector('.room-title');
    if (roomTitle) {
        // 사용자 수를 가져와서 제목에 표시
        const users = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_users`) || '[]');
        const userCount = users.length;
        roomTitle.textContent = `1:1 대화방 (${roomId}) - ${userCount}명`;
    }
}

/**
 * 연결 상태 업데이트
 */
function updateConnectionStatus(status) {
    const roomStatus = document.getElementById('roomStatus');
    if (roomStatus) {
        roomStatus.textContent = status;
    }
}

/**
 * 실시간 연결 상태 모니터링
 */
function startConnectionMonitoring() {
    console.log('🔍 연결 상태 모니터링 시작...');
    
    const monitorInterval = setInterval(() => {
        try {
            if (!isConnected || !roomId) {
                console.log('⏹️ 모니터링 중단: 연결 상태 또는 방 ID 없음');
                clearInterval(monitorInterval);
                return;
            }
            
            // 방 상태 확인
            const roomStatus = localStorage.getItem(`botornot_room_${roomId}_status`);
            if (roomStatus !== 'active') {
                console.log('❌ 방이 비활성화되었습니다.');
                showGameEndModal('상대방이 방을 나갔습니다.');
                clearInterval(monitorInterval);
                return;
            }
            
            // 상대방 연결 상태 확인
            checkOpponentStatus();
            
            // 방 제목 업데이트 (사용자 수 반영)
            updateRoomTitle();
            
        } catch (error) {
            console.error('❌ 연결 상태 모니터링 중 오류 발생:', error);
        }
    }, 1000); // 1초마다 확인 (더 빠른 반응)
}

/**
 * 상대방 상태 확인
 */
function checkOpponentStatus() {
    try {
        const users = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_users`) || '[]');
        const userCount = users.length;
        
        // 상대방 ID 찾기
        const opponentId = users.find(id => id !== currentUser.id);
        
        if (!opponentId) {
            console.log('⏳ 상대방이 아직 접속하지 않았습니다. 대기 중...');
            // 상대방이 아직 접속하지 않은 경우, 방을 종료하지 않고 대기
            return;
        }
        
        // 상대방이 정상적으로 접속되어 있음 (활동 시간 무시)
        
    } catch (error) {
        console.error('❌ 상대방 상태 확인 중 오류 발생:', error);
    }
}

/**
 * 방 나가기 함수
 */
function leaveRoom() {
    try {
        if (confirm('정말로 방을 나가시겠습니까?')) {
            console.log('방을 나갑니다.');
            
            // 방 상태를 비활성화로 변경
            if (roomId) {
                localStorage.setItem(`botornot_room_${roomId}_status`, 'inactive');
                
                // 사용자 목록에서 제거
                const users = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_users`) || '[]');
                const updatedUsers = users.filter(id => id !== currentUser.id);
                localStorage.setItem(`botornot_room_${roomId}_users`, JSON.stringify(updatedUsers));
                
                // 상대방에게 방 나감 알림
                notifyOpponentLeave();
            }
            
            // 메인 페이지로 리다이렉트
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('방 나가기 중 오류 발생:', error);
        window.location.href = 'index.html';
    }
}

/**
 * 상대방에게 방 나감 알림
 */
function notifyOpponentLeave() {
    try {
        if (roomId) {
            const users = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_users`) || '[]');
            const opponentId = users.find(id => id !== currentUser.id);
            
            if (opponentId) {
                localStorage.setItem(`botornot_room_${roomId}_user_${opponentId}_leave_notification`, 'true');
            }
        }
    } catch (error) {
        console.error('상대방 알림 전송 중 오류 발생:', error);
    }
}

/**
 * 메시지 전송 함수
 */
function sendMessage() {
    try {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message && isConnected) {
            console.log('메시지 전송:', message);
            
            // 메시지 생성
            const messageData = {
                id: ++messageCounter,
                text: message,
                sender: currentUser.id,
                senderName: currentUser.name,
                timestamp: Date.now(),
                isOwn: true
            };
            
            // 메시지 표시
            displayMessage(messageData);
            
            // 상대방에게 메시지 전송
            sendMessageToOpponent(messageData);
            
            // 입력 필드 초기화
            messageInput.value = '';
            messageInput.style.height = 'auto';
            

            
        } else if (!isConnected) {
            console.log('연결이 끊어져 메시지를 전송할 수 없습니다.');
            alert('연결이 끊어져 메시지를 전송할 수 없습니다.');
        } else {
            console.log('빈 메시지는 전송할 수 없습니다.');
        }
    } catch (error) {
        console.error('메시지 전송 중 오류 발생:', error);
    }
}

/**
 * 메시지 표시
 */
function displayMessage(messageData) {
    try {
        const messagesContainer = document.getElementById('messagesContainer');
        
        // 플레이스홀더 제거
        const placeholder = messagesContainer.querySelector('.message-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        // 메시지 요소 생성
        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageData.isOwn ? 'own' : 'other'}`;
        
        const time = new Date(messageData.timestamp);
        const timeString = time.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageElement.innerHTML = `
            <div class="message-content">
                ${messageData.text}
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // 스크롤을 맨 아래로
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
    } catch (error) {
        console.error('메시지 표시 중 오류 발생:', error);
    }
}

/**
 * 상대방에게 메시지 전송
 */
function sendMessageToOpponent(messageData) {
    try {
        if (roomId) {
            const users = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_users`) || '[]');
            const opponentId = users.find(id => id !== currentUser.id);
            
            if (opponentId) {
                // 상대방의 메시지 큐에 추가
                const messageQueue = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_messages_${opponentId}`) || '[]');
                messageQueue.push({
                    ...messageData,
                    isOwn: false
                });
                localStorage.setItem(`botornot_room_${roomId}_messages_${opponentId}`, JSON.stringify(messageQueue));
                
                // 상대방에게 새 메시지 알림
                localStorage.setItem(`botornot_room_${roomId}_user_${opponentId}_new_message`, 'true');
            }
        }
    } catch (error) {
        console.error('상대방에게 메시지 전송 중 오류 발생:', error);
    }
}



/**
 * 새 메시지 확인
 */
function checkNewMessages() {
    try {
        if (roomId && currentUser) {
            const messageQueue = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_messages_${currentUser.id}`) || '[]');
            
            if (messageQueue.length > 0) {
                // 새 메시지 표시
                messageQueue.forEach(messageData => {
                    displayMessage(messageData);
                });
                
                // 메시지 큐 비우기
                localStorage.removeItem(`botornot_room_${roomId}_messages_${currentUser.id}`);
                
                // 새 메시지 알림 제거
                localStorage.removeItem(`botornot_room_${roomId}_user_${currentUser.id}_new_message`);
            }
        }
    } catch (error) {
        console.error('새 메시지 확인 중 오류 발생:', error);
    }
}

/**
 * 게임 종료 모달 표시
 */
function showGameEndModal(message) {
    try {
        const modal = document.getElementById('gameEndModal');
        const modalBody = modal.querySelector('.modal-body p:last-child');
        
        if (modalBody) {
            modalBody.textContent = message;
        }
        
        modal.style.display = 'flex';
        isConnected = false;
        
        // 방 상태 정리
        if (roomId) {
            localStorage.removeItem(`botornot_room_${roomId}_status`);
            localStorage.removeItem(`botornot_room_${roomId}_users`);
        }
        
    } catch (error) {
        console.error('게임 종료 모달 표시 중 오류 발생:', error);
    }
}

/**
 * 텍스트 영역 자동 높이 조절
 */
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    
    // 최대 높이 제한
    const maxHeight = 120;
    if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = maxHeight + 'px';
        textarea.style.overflowY = 'auto';
    } else {
        textarea.style.overflowY = 'hidden';
    }
}

/**
 * 새 메시지 모니터링
 */
function startMessageMonitoring() {
    const messageInterval = setInterval(() => {
        try {
            if (!isConnected) {
                clearInterval(messageInterval);
                return;
            }
            
            // 새 메시지 확인
            checkNewMessages();
            
            // 상대방 방 나감 알림 확인
            checkOpponentLeaveNotification();
            
        } catch (error) {
            console.error('메시지 모니터링 중 오류 발생:', error);
        }
    }, 1000); // 1초마다 확인
}

/**
 * 상대방 방 나감 알림 확인
 */
function checkOpponentLeaveNotification() {
    try {
        if (roomId && currentUser) {
            const leaveNotification = localStorage.getItem(`botornot_room_${roomId}_user_${currentUser.id}_leave_notification`);
            
            if (leaveNotification === 'true') {
                console.log('상대방이 방을 나갔습니다.');
                showGameEndModal('상대방이 방을 나갔습니다.');
                localStorage.removeItem(`botornot_room_${roomId}_user_${currentUser.id}_leave_notification`);
            }
        }
    } catch (error) {
        console.error('상대방 방 나감 알림 확인 중 오류 발생:', error);
    }
}

// 메시지 모니터링 시작
setTimeout(() => {
    startMessageMonitoring();
}, 1000);

/**
 * 페이지 가시성 변경 감지
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('대화방이 숨겨졌습니다.');
        // 새 메시지 확인
        checkNewMessages();
    } else {
        console.log('대화방이 다시 활성화되었습니다.');
        // 새 메시지 확인
        checkNewMessages();
    }
});

/**
 * 페이지 언로드 시 처리
 */
window.addEventListener('beforeunload', function() {
    if (isConnected && roomId) {
        // 방 상태를 비활성화로 변경
        localStorage.setItem(`botornot_room_${roomId}_status`, 'inactive');
        
        // 사용자 목록에서 제거
        const users = JSON.parse(localStorage.getItem(`botornot_room_${roomId}_users`) || '[]');
        const updatedUsers = users.filter(id => id !== currentUser.id);
        localStorage.setItem(`botornot_room_${roomId}_users`, JSON.stringify(updatedUsers));
        
        // 상대방에게 방 나감 알림
        notifyOpponentLeave();
    }
});

/**
 * 에러 핸들링
 */
window.addEventListener('error', function(e) {
    console.error('대화방 에러 발생:', e.error);
});

/**
 * 온라인/오프라인 상태 모니터링
 */
window.addEventListener('online', function() {
    console.log('인터넷 연결이 복구되었습니다.');
    updateConnectionStatus('연결됨');
});

window.addEventListener('offline', function() {
    console.log('인터넷 연결이 끊어졌습니다.');
    updateConnectionStatus('연결 끊김');
});
