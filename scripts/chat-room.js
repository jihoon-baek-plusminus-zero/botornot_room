// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('메신저 대화방이 로드되었습니다.');
    
    // 요소들 가져오기
    const leaveRoomBtn = document.getElementById('leaveRoomBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('messageInput');
    
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
    
    // 페이지 로드 완료 로그
    const loadTime = performance.now();
    console.log(`메신저 대화방 로드 완료: ${loadTime.toFixed(2)}ms`);
});

/**
 * 방 나가기 함수
 */
function leaveRoom() {
    try {
        if (confirm('정말로 방을 나가시겠습니까?')) {
            console.log('방을 나갑니다.');
            
            // 메인 페이지로 리다이렉트
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('방 나가기 중 오류 발생:', error);
        // 에러가 발생해도 메인 페이지로 이동
        window.location.href = 'index.html';
    }
}

/**
 * 메시지 전송 함수
 */
function sendMessage() {
    try {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message) {
            console.log('메시지 전송:', message);
            
            // TODO: 실제 메시지 전송 로직 구현 예정
            console.log('📤 메시지 전송 준비 완료 (기능 미연결)');
            
            // 입력 필드 초기화
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // TODO: 메시지 표시 로직 구현 예정
            console.log('💬 메시지 표시 준비 완료 (기능 미연결)');
        } else {
            console.log('빈 메시지는 전송할 수 없습니다.');
        }
    } catch (error) {
        console.error('메시지 전송 중 오류 발생:', error);
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
 * 페이지 가시성 변경 감지
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('대화방이 숨겨졌습니다.');
        // TODO: 백그라운드 처리 로직
    } else {
        console.log('대화방이 다시 활성화되었습니다.');
        // TODO: 포그라운드 처리 로직
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
});

window.addEventListener('offline', function() {
    console.log('인터넷 연결이 끊어졌습니다.');
});
