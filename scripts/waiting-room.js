// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('1:1 대기방이 로드되었습니다.');
    
    // 요소들 가져오기
    const cancelMatchingBtn = document.getElementById('cancelMatchingBtn');
    
    // 대기 상태 초기화
    let isWaiting = true;
    let currentUser = null;
    
    // 사용자 정보 생성 및 대기열에 추가
    initializeUser();
    
    // 현재 사용자를 전역으로 노출 (매칭 시스템에서 접근 가능)
    window.currentUser = currentUser;
    
    // 매칭 취소 버튼 클릭 이벤트
    cancelMatchingBtn.addEventListener('click', function() {
        console.log('매칭 취소 요청됨');
        cancelMatching();
    });
    
    // ESC 키로 매칭 취소
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cancelMatching();
        }
    });
    
    // 페이지 언로드 시 대기열에서 제거
    window.addEventListener('beforeunload', function() {
        if (currentUser && isWaiting) {
            window.matchingSystem.removeFromQueue(currentUser.id);
        }
    });
});

/**
 * 사용자 초기화 및 대기열 추가
 */
function initializeUser() {
    try {
        // 사용자 정보 생성
        currentUser = {
            id: generateUserId(),
            name: generateUserName(),
            joinTime: Date.now(),
            tabId: generateTabId()
        };
        
        console.log('사용자 정보:', currentUser);
        
        // 매치메이킹 시스템의 대기열에 추가
        if (window.matchingSystem) {
            const queuePosition = window.matchingSystem.addToQueue(currentUser);
            console.log(`대기열에 추가되었습니다. (위치: ${queuePosition})`);
            
            // 대기열 상태 모니터링 시작
            startQueueMonitoring();
        } else {
            console.error('매치메이킹 시스템을 찾을 수 없습니다.');
            // 3초 후 재시도
            setTimeout(() => {
                if (window.matchingSystem) {
                    console.log('매치메이킹 시스템 재시도 중...');
                    initializeUser();
                }
            }, 3000);
        }
    } catch (error) {
        console.error('사용자 초기화 중 오류 발생:', error);
    }
}

/**
 * 대기열 상태 모니터링
 */
function startQueueMonitoring() {
    const monitorInterval = setInterval(() => {
        if (!isWaiting || !currentUser) {
            clearInterval(monitorInterval);
            return;
        }
        
        // 대기열 상태 확인
        if (window.matchingSystem) {
            const queueStatus = window.matchingSystem.getQueueStatus();
            console.log('현재 대기열 상태:', queueStatus);
            
            // 사용자가 대기열에서 제거되었는지 확인 (매칭 완료)
            if (queueStatus.queue.every(user => user.id !== currentUser.id)) {
                console.log('사용자가 대기열에서 제거되었습니다. (매칭 완료 예정)');
                clearInterval(monitorInterval);
                
                // 매칭 완료 상태 확인 (즉시 확인)
                setTimeout(() => {
                    window.matchingSystem.checkUserMatchStatus();
                }, 100);
            }
        }
    }, 2000); // 2초마다 확인
}

/**
 * 매칭 취소 함수
 */
function cancelMatching() {
    if (confirm('정말로 매칭을 취소하시겠습니까?')) {
        console.log('매칭이 취소되었습니다.');
        
        // 대기 상태 중지
        isWaiting = false;
        
        // 대기열에서 사용자 제거
        if (currentUser && window.matchingSystem) {
            window.matchingSystem.removeFromQueue(currentUser.id);
        }
        
        // 메인 페이지로 리다이렉트
        window.location.href = 'index.html';
    }
}

/**
 * 사용자 ID 생성
 */
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 사용자 이름 생성
 */
function generateUserName() {
    const adjectives = ['즐거운', '신나는', '재미있는', '특별한', '멋진', '아름다운', '훌륭한', '완벽한'];
    const nouns = ['사람', '친구', '동료', '파트너', '메이트', '컴패니언'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return randomAdjective + randomNoun;
}

/**
 * 탭 ID 생성
 */
function generateTabId() {
    return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 페이지 가시성 변경 감지
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('페이지가 숨겨졌습니다.');
        // TODO: 백그라운드 처리 로직
    } else {
        console.log('페이지가 다시 활성화되었습니다.');
        // TODO: 포그라운드 처리 로직
    }
});

/**
 * 에러 핸들링
 */
window.addEventListener('error', function(e) {
    console.error('대기방 에러 발생:', e.error);
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
