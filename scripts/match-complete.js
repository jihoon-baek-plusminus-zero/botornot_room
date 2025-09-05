// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('매칭 완료 페이지가 로드되었습니다.');
    
    // URL 파라미터에서 매칭 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    const matchTime = urlParams.get('matchTime');
    
    // 방 ID 표시
    const roomIdElement = document.getElementById('roomId');
    if (roomId) {
        roomIdElement.textContent = roomId;
    } else {
        roomIdElement.textContent = 'N/A';
    }
    
    // 매칭 시간 표시
    const matchTimeElement = document.getElementById('matchTime');
    if (matchTime) {
        const date = new Date(parseInt(matchTime));
        matchTimeElement.textContent = date.toLocaleString('ko-KR');
    } else {
        const now = new Date();
        matchTimeElement.textContent = now.toLocaleString('ko-KR');
    }
    
    // 페이지 로드 성능 모니터링
    const loadTime = performance.now();
    console.log(`매칭 완료 페이지 로드 완료: ${loadTime.toFixed(2)}ms`);
    
    // 방 정보 로깅
    console.log('방 정보:', {
        roomId: roomId,
        matchTime: matchTime,
        currentTime: new Date().toISOString()
    });
    
    // 5초 후 1:1 대화방으로 자동 이동
    setTimeout(() => {
        console.log('자동 리다이렉트 준비 중...');
        if (roomId) {
            redirectToChatRoom(roomId, matchTime);
        } else {
            window.location.href = 'index.html';
        }
    }, 5000);
});

/**
 * 1:1 대화방으로 리다이렉트
 */
function redirectToChatRoom(roomId, matchTime) {
    try {
        console.log(`1:1 대화방으로 이동합니다. 방 ID: ${roomId}`);
        
        // 1:1 대화방으로 이동 (방 ID와 매칭 시간 전달)
        const chatRoomUrl = `1-1-room.html?roomId=${roomId}&matchTime=${matchTime}`;
        window.location.href = chatRoomUrl;
        
    } catch (error) {
        console.error('대화방 리다이렉트 중 오류 발생:', error);
        // 에러가 발생하면 메인 페이지로 이동
        window.location.href = 'index.html';
    }
}

/**
 * 방 정보를 콘솔에 출력
 */
function logRoomInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('현재 방 정보:', {
        roomId: urlParams.get('roomId'),
        matchTime: urlParams.get('matchTime'),
        timestamp: Date.now()
    });
}

/**
 * 페이지 가시성 변경 감지
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('매칭 완료 페이지가 숨겨졌습니다.');
    } else {
        console.log('매칭 완료 페이지가 다시 활성화되었습니다.');
        logRoomInfo();
    }
});

/**
 * 페이지 언로드 시 정리
 */
window.addEventListener('beforeunload', function() {
    console.log('매칭 완료 페이지를 떠납니다.');
    // TODO: 서버에 방 입장 완료 알림
});

/**
 * 에러 핸들링
 */
window.addEventListener('error', function(e) {
    console.error('매칭 완료 페이지 에러 발생:', e.error);
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
